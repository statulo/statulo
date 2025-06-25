import { z } from "zod";
import type { Prisma } from "@prisma/client";
import type { AuthContext } from "@/utils/auth/context";
import { makeRouter } from "@/utils/router";
import { handle } from "@/utils/handle";
import { permissions } from "@/utils/permissions/permissions";
import { prisma } from "@/modules/db";
import { ApiError, NotFoundError } from "@/utils/error";
import { mapPage, pagerSchema } from "@/utils/pages";
import { mapExpandedUser, mapUser } from "@/routes/v0/mappings/user";
import { mapOrgInviteInfo } from "@/routes/v1/mappings/org-invite";
import { passwordSchema } from "@/utils/zod";
import { generateSecureKey, hashPassword, verifyPassword } from "@/utils/auth/password";

function getAtMe(auth: AuthContext, id: string) {
  if (id === "@me") return auth.data.getUserIdOrDefault() ?? id;
  return id;
}

export const userRouter = makeRouter((app) => {
  app.delete(
    "/api/v1/users/:id",
    {
      schema: {
        description: "Delete user",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      const id = getAtMe(auth, params.id);
      auth.can404(permissions.user.delete({ usr: id }));

      const oldUsers = await prisma.user.deleteMany({
        where: {
          id: id,
        },
      });
      if (oldUsers.count === 0) throw new NotFoundError();
      return {
        id: id,
      };
    }),
  );

  app.get(
    "/api/v1/users/:id",
    {
      schema: {
        description: "Get user",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      const id = getAtMe(auth, params.id);
      auth.can404(permissions.user.read({ usr: id }));
      const isSelf = auth.checkers.isUser(id);
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          orgMembers: {
            include: {
              org: true,
            },
          },
        },
      });
      if (!user) throw new NotFoundError();
      return isSelf ? mapExpandedUser(user) : mapUser(user);
    }),
  );

  app.get(
    "/api/v1/users/:id/org-invites",
    {
      schema: {
        description: "List org invites",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.checkAuthentication();
      auth.checkEmailVerified();
      const id = getAtMe(auth, params.id);
      auth.can404(permissions.user.orgInvites.list({ usr: id }));

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) throw new NotFoundError();

      const invites = await prisma.orgInvite.findMany({
        where: {
          OR: [{
            email: user.email,
          }, {
            userId: user.id,
          }],
        },
        include: {
          org: true,
        },
      });
      return invites.map(v => mapOrgInviteInfo(v));
    }),
  );

  app.get(
    "/api/v1/users",
    {
      schema: {
        description: "List users",
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, auth }) => {
      auth.checkAuthentication();
      auth.can(permissions.user.list({ }));

      const totalUsers = await prisma.user.count();
      const users = await prisma.user.findMany({
        take: query.limit,
        skip: query.offset,
        orderBy: {
          createdAt: "desc",
        },
      });
      return mapPage(query, users.map(mapUser), totalUsers);
    }),
  );

  app.patch(
    "/api/v1/users/:id/security",
    {
      schema: {
        description: "Edit user security settings",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          email: z.object({
            newEmail: z.string().email(),
            code: z.string(),
          }).optional(),
          password: z.object({
            oldPassword: z.string(),
            newPassword: passwordSchema(),
          }).optional(),
        }),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.checkAuthentication();
      const id = getAtMe(auth, params.id);
      auth.can404(permissions.user.edit({ usr: id }));
      const session = auth.checkers.isAuthType("session") ? auth.data.getSession() : null;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) throw new NotFoundError();

      const updateData: Prisma.UserUpdateInput = {};

      if (body.email) {
        const verificationCode = await prisma.pendingEmailVerification.findUnique({
          where: {
            userId: id,
            email_code: {
              email: body.email.newEmail,
              code: body.email.code,
            },
          },
        });
        if (!verificationCode) throw ApiError.forCode("authInvalidInput", 400);
        if (verificationCode.expiresAt < new Date()) throw ApiError.forCode("authInvalidInput", 400);
        await prisma.pendingEmailVerification.delete({
          where: {
            id: verificationCode.id,
          },
        });

        updateData.email = body.email.newEmail;
        updateData.securityStamp = generateSecureKey();
      }

      if (body.password) {
        const isCorrectOldPassword = await verifyPassword(user.passwordHash, body.password.oldPassword);
        if (!isCorrectOldPassword)
          throw ApiError.forCode("authInvalidInput", 400);
        updateData.passwordHash = await hashPassword(body.password.newPassword);
        updateData.securityStamp = generateSecureKey();
      }

      const newUser = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.update({
          where: {
            id,
          },
          include: {
            orgMembers: {
              include: {
                org: true,
              },
            },
          },
          data: updateData,
        });
        if (session && updateData.securityStamp) {
          await tx.userSession.update({
            where: {
              id: session.id,
            },
            data: {
              securityStamp: updateData.securityStamp,
            },
          });
        }
        return newUser;
      });

      return mapExpandedUser(newUser);
    }),
  );
});
