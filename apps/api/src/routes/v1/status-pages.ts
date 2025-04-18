import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/db";
import { handle } from "@/utils/handle";
import { getExternalId, getId } from "@/utils/id";
import { permissions } from "@/utils/permissions/permissions";
import { makeRouter } from "@/utils/router";
import { NotFoundError } from "@/utils/error";
import { mapPage, pagerSchema } from "@/utils/pages";
import { mapStatusPage } from "@/routes/v1/mappings/status-page";

export const statusPageRouter = makeRouter((app) => {
  app.post(
    "/api/v1/organisations/:orgId/status-pages",
    {
      schema: {
        description: "Create status page",
        params: z.object({
          orgId: z.string(),
        }),
        body: z.object({
          name: z.string(),
        }),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.checkAuthentication();
      auth.can(permissions.org.statusPage.create({ org: params.orgId }));

      const createPayload: Prisma.StatusPageUncheckedCreateInput = {
        orgId: params.orgId,
        id: getId("stspg"),
        externalId: getExternalId(),
        name: body.name,
      };

      const newStatusPage = await prisma.statusPage.create({
        data: createPayload,
      });

      return mapStatusPage(newStatusPage);
    }),
  );

  app.patch(
    "/api/v1/status-pages/:id",
    {
      schema: {
        description: "Edit status page",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
          regenerateExternalId: z.boolean().optional(),
        }),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.checkAuthentication();
      const statusPage = await prisma.statusPage.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!statusPage) throw new NotFoundError();
      auth.can404(permissions.org.statusPage.edit({ org: statusPage.orgId, stspg: statusPage.id }));

      const updatePayload: Prisma.StatusPageUncheckedUpdateInput = {
        name: body.name,
        externalId: body.regenerateExternalId ? getExternalId() : undefined,
      };

      const newStatusPage = await prisma.statusPage.update({
        where: {
          id: statusPage.id,
        },
        data: updatePayload,
      });
      return mapStatusPage(newStatusPage);
    }),
  );

  app.delete(
    "/api/v1/status-pages/:id",
    {
      schema: {
        description: "Delete status page",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      const statusPage = await prisma.statusPage.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!statusPage) throw new NotFoundError();
      auth.can404(permissions.org.statusPage.delete({ org: statusPage.orgId, stspg: statusPage.id }));

      const oldStatusPage = await prisma.statusPage.delete({
        where: {
          id: statusPage.id,
        },
      });
      if (oldStatusPage == null) throw new NotFoundError();
      return {
        id: statusPage.id,
      };
    }),
  );

  app.get(
    "/api/v1/status-pages/:id",
    {
      schema: {
        description: "Get status page",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      const statusPage = await prisma.statusPage.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!statusPage) throw new NotFoundError();
      auth.can404(permissions.org.statusPage.read({ org: statusPage.orgId, stspg: statusPage.id }));
      return mapStatusPage(statusPage);
    }),
  );

  app.get(
    "/api/v1/organisations/:orgId/status-pages",
    {
      schema: {
        description: "List statusPages",
        params: z.object({
          orgId: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, params, auth }) => {
      auth.checkAuthentication();
      auth.can(permissions.org.statusPage.list({ org: params.orgId }));

      const totalStatusPages = await prisma.statusPage.count({
        where: {
          orgId: params.orgId,
        },
      });
      const statusPages = await prisma.statusPage.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.orgId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return mapPage(query, statusPages.map(mapStatusPage), totalStatusPages);
    }),
  );
});
