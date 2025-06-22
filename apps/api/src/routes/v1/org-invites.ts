import { z } from "zod";
import { mapOrgInvite, mapOrgInviteInfo } from "./mappings/org-invite";
import { mapPage, pagerSchema } from "@/utils/pages";
import { makeRouter } from "@/utils/router";
import { handle } from "@/utils/handle";
import { permissions } from "@/utils/permissions/permissions";
import { prisma } from "@/modules/db";
import { ApiError, NotFoundError } from "@/utils/error";
import { orgRolesSchema } from "@/utils/permissions/roles";
import { getId } from "@/utils/id";
import { generateSecureKey } from "@/utils/auth/password";
import { parseAuthToken } from "@/utils/auth/tokens";
import { mapOrgMember } from "@/routes/v1/mappings/org-member";
import { orgInviteEmail } from "@/modules/emails/templates/org-invite";
import { makeInvitationUrl } from "@/utils/urls";

export const orgInviteRouter = makeRouter((app) => {
  app.post(
    "/api/v1/org-invites/accept",
    {
      schema: {
        description: "Accept invitation",
        body: z.object({
          token: z.string(),
        }),
      },
    },
    handle(async ({ body, auth }) => {
      auth.check(c => c.isAuthType("session"));
      const session = auth.data.getSession();
      const user = session.user;

      const tokenData = parseAuthToken(body.token);
      if (tokenData?.t !== "invite") throw ApiError.forCode("authInvalidToken");

      const invite = await prisma.orgInvite.findFirst({
        where: {
          code: tokenData.code,
        },
      });
      if (!invite) throw new NotFoundError();
      const wrongUserId = invite.userId !== null && invite.userId !== user.id;
      const wrongEmail = invite.email !== user.email;
      if (wrongUserId && wrongEmail) throw new NotFoundError();

      const [newOrgMember] = await prisma.$transaction([
        prisma.orgMember.create({
          data: {
            id: getId("orgmbr"),
            orgId: invite.orgId,
            userId: user.id,
            roles: invite.roles,
          },
          include: {
            org: true,
            user: true,
          },
        }),
        prisma.user.update({
          where: {
            id: auth.data.getUserId(),
          },
          data: {
            emailVerified: true,
          },
        }),
        prisma.orgInvite.delete({
          where: {
            id: invite.id,
          },
        }),
      ]);

      return mapOrgMember(newOrgMember);
    }),
  );

  app.post(
    "/api/v1/org-invites/:id/accept",
    {
      schema: {
        description: "Accept invitation from user login",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.check(c => c.isAuthType("session"));
      auth.checkEmailVerified();
      const session = auth.data.getSession();
      const user = session.user;

      const invite = await prisma.orgInvite.findFirst({
        where: {
          id: params.id,
        },
      });
      if (!invite) throw new NotFoundError();
      const wrongUserId = invite.userId !== null && invite.userId !== user.id;
      const wrongEmail = invite.email !== user.email;
      if (wrongUserId && wrongEmail) throw new NotFoundError();

      const [newOrgMember] = await prisma.$transaction([
        prisma.orgMember.create({
          data: {
            id: getId("orgmbr"),
            orgId: invite.orgId,
            userId: user.id,
            roles: invite.roles,
          },
          include: {
            org: true,
            user: true,
          },
        }),
        prisma.user.update({
          where: {
            id: auth.data.getUserId(),
          },
          data: {
            emailVerified: true,
          },
        }),
        prisma.orgInvite.delete({
          where: {
            id: invite.id,
          },
        }),
      ]);

      return mapOrgMember(newOrgMember);
    }),
  );

  app.get(
    "/api/v1/org-invites/accept",
    {
      schema: {
        description: "Get invitation data",
        querystring: z.object({
          token: z.string(),
        }),
      },
    },
    handle(async ({ query }) => {
      const tokenData = parseAuthToken(query.token);
      if (tokenData?.t !== "invite") throw ApiError.forCode("authInvalidToken");

      const invite = await prisma.orgInvite.findFirst({
        where: {
          code: tokenData.code,
        },
        include: {
          org: true,
        },
      });
      if (!invite) throw new NotFoundError();

      return mapOrgInviteInfo(invite);
    }),
  );

  app.post(
    "/api/v1/organisations/:org/org-invites",
    {
      schema: {
        description: "Create invitation",
        params: z.object({
          org: z.string(),
        }),
        body: z.object({
          email: z.string().email(),
          roles: z.array(orgRolesSchema).min(1),
        }),
      },
    },
    handle(async ({ params, body, auth }) => {
      auth.checkAuthentication();
      auth.checkEmailVerified();
      auth.can(permissions.org.invite.create({ org: params.org }));

      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      const newInvite = await prisma.orgInvite.create({
        data: {
          email: body.email,
          code: generateSecureKey(),
          id: getId("orginv"),
          orgId: params.org,
          userId: user?.id,
          roles: body.roles,
        },
        include: {
          org: true,
          user: true,
        },
      });

      await orgInviteEmail.send({
        props: {
          org: {
            name: newInvite.org.name,
          },
          inviteLink: makeInvitationUrl(newInvite),
        },
        to: newInvite.email,
      });

      return mapOrgInvite(newInvite);
    }),
  );

  app.delete(
    "/api/v1/organisations/:org/org-invites/:id",
    {
      schema: {
        description: "Delete invitation",
        params: z.object({
          org: z.string(),
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      auth.can404(permissions.org.invite.delete({ org: params.org, inv: params.id }));

      const oldInvites = await prisma.orgInvite.deleteMany({
        where: {
          orgId: params.org,
          id: params.id,
        },
      });
      if (oldInvites.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    "/api/v1/organisations/:org/org-invites",
    {
      schema: {
        description: "List invites",
        params: z.object({
          org: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ params, auth, query }) => {
      auth.checkAuthentication();
      auth.can(permissions.org.invite.list({ org: params.org }));

      const totalInvites = await prisma.orgInvite.count();
      const invites = await prisma.orgInvite.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.org,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          org: true,
          user: true,
        },
      });
      return mapPage(query, invites.map(mapOrgInvite), totalInvites);
    }),
  );
});
