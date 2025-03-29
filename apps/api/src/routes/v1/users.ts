import { z } from 'zod';
import type { AuthContext } from '@/utils/auth/context';
import { makeRouter } from '@/utils/router';
import { handle } from '@/utils/handle';
import { permissions } from '@/utils/permissions/permissions';
import { prisma } from '@/modules/db';
import { NotFoundError } from '@/utils/error';
import { mapExpandedUser, mapUser } from '../v0/mappings/user';
import { mapPage, pagerSchema } from '@/utils/pages';

function getAtMe(auth: AuthContext, id: string) {
  if (id === '@me') return auth.data.getUserIdOrDefault() ?? id;
  return id;
}

export const userRouter = makeRouter((app) => {
  app.delete(
    '/api/v1/users/:id',
    {
      schema: {
        description: 'Delete user',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      const id = getAtMe(auth, params.id);
      auth.can(permissions.user.delete({ usr: id }));

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
    '/api/v1/users/:id',
    {
      schema: {
        description: 'Get user',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      const id = getAtMe(auth, params.id);
      auth.can(permissions.user.delete({ usr: id }));
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
    '/api/v1/users',
    {
      schema: {
        description: 'List users',
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, auth }) => {
      auth.can(permissions.user.list({ }));

      const totalUsers = await prisma.user.count();
      const users = await prisma.user.findMany({
        take: query.limit,
        skip: query.offset,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return mapPage(query, users.map(mapUser), totalUsers);
    }),
  );
});
