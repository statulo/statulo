import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/db";
import { handle } from "@/utils/handle";
import { getId, getUntypedId } from "@/utils/id";
import { permissions } from "@/utils/permissions/permissions";
import { makeRouter } from "@/utils/router";
import { ApiError, NotFoundError } from "@/utils/error";
import { mapPage, pagerSchema } from "@/utils/pages";
import type { EnumType } from "@/utils/types";
import { mapContactPoint } from "@/routes/v1/mappings/contact-point";

export const contactPointTypes = {
  member: "member",
  discord: "discord",
} as const;
export type ContactPointTypes = EnumType<typeof contactPointTypes>;

export function createContactPointJoins() {
  return {
    member: {
      include: {
        orgMember: {
          include: {
            user: true,
          },
        },
      },
    },
    discord: true,
  } as const satisfies Prisma.ContactPointInclude;
}

export const contactPointRouter = makeRouter((app) => {
  app.post(
    "/api/v1/organisations/:id/contact-points",
    {
      schema: {
        description: "Create contact point",
        params: z.object({
          id: z.string(),
        }),
        body: z.discriminatedUnion("type", [
          z.object({
            type: z.literal(contactPointTypes.member),
            data: z.object({
              orgMemberId: z.string(),
            }),
          }),
          z.object({
            type: z.literal(contactPointTypes.discord),
            data: z.object({
              webhookUrl: z.string().url(),
            }),
          }),
        ]),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.checkAuthentication();
      auth.can(permissions.org.contactPoint.create({ org: params.id }));

      const createPayload: Prisma.ContactPointUncheckedCreateInput = {
        orgId: params.id,
        id: getId("con"),
        type: body.type,
      };

      if (body.type === contactPointTypes.member) {
        createPayload.member = {
          create: {
            id: getUntypedId(),
            orgMemberId: body.data.orgMemberId,
          },
        };
      }

      if (body.type === contactPointTypes.discord) {
        createPayload.discord = {
          create: {
            id: getUntypedId(),
            webhookUrl: body.data.webhookUrl,
          },
        };
      }

      const newContactPoint = await prisma.contactPoint.create({
        data: createPayload,
        include: createContactPointJoins(),
      });
      return mapContactPoint(newContactPoint);
    }),
  );

  app.patch(
    "/api/v1/contact-points/:id",
    {
      schema: {
        description: "Edit contact point",
        params: z.object({
          id: z.string(),
        }),
        body: z.discriminatedUnion("type", [
          z.object({
            type: z.literal(contactPointTypes.discord),
            data: z.object({
              webhookUrl: z.string().url().optional(),
            }),
          }),
        ]),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.checkAuthentication();
      const contactPoint = await prisma.contactPoint.findUnique({
        where: {
          id: params.id,
        },
        include: createContactPointJoins(),
      });
      if (!contactPoint) throw new NotFoundError();
      auth.can404(permissions.org.contactPoint.edit({ org: contactPoint.orgId, con: contactPoint.id }));

      if (contactPoint.type !== body.type)
        throw ApiError.forCode("cantChangeType", 400);

      const updatePayload: Prisma.ContactPointUncheckedUpdateInput = {};

      if (contactPoint.type === contactPointTypes.discord) {
        updatePayload.discord = {
          update: {
            webhookUrl: body.data.webhookUrl,
          },
        };
      }

      const newContactPoint = await prisma.contactPoint.update({
        where: {
          id: contactPoint.id,
        },
        data: updatePayload,
        include: createContactPointJoins(),
      });
      return mapContactPoint(newContactPoint);
    }),
  );

  app.delete(
    "/api/v1/contact-points/:id",
    {
      schema: {
        description: "Delete contact point",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      const contactPoint = await prisma.contactPoint.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!contactPoint) throw new NotFoundError();
      auth.can404(permissions.org.contactPoint.delete({ org: contactPoint.orgId, con: contactPoint.id }));

      const oldContactPoints = await prisma.contactPoint.deleteMany({
        where: {
          id: params.id,
        },
      });
      if (oldContactPoints.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    "/api/v1/contact-point/:id",
    {
      schema: {
        description: "Get contact point",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      const contactPoint = await prisma.contactPoint.findUnique({
        where: {
          id: params.id,
        },
        include: createContactPointJoins(),
      });
      if (!contactPoint) throw new NotFoundError();
      auth.can404(permissions.org.contactPoint.read({ org: contactPoint.orgId, con: contactPoint.id }));

      return mapContactPoint(contactPoint);
    }),
  );

  app.get(
    "/api/v1/organisations/:id/contact-points",
    {
      schema: {
        description: "List contact points",
        params: z.object({
          id: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, params, auth }) => {
      auth.checkAuthentication();
      auth.can(permissions.org.contactPoint.list({ org: params.id }));

      const totalContactPoints = await prisma.contactPoint.count({
        where: {
          orgId: params.id,
        },
      });
      const contactPoints = await prisma.contactPoint.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: createContactPointJoins(),
      });
      return mapPage(query, contactPoints.map(mapContactPoint), totalContactPoints);
    }),
  );
});
