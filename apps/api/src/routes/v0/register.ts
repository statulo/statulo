import { prisma } from '@/modules/db';
import { hashPassword } from '@/utils/auth/password';
import { createSession, makeSessionToken } from '@/utils/auth/session';
import { handle } from '@/utils/handle';
import { getId } from '@/utils/id';
import { permissions } from '@/utils/permissions/permissions';
import { makeRouter } from '@/utils/router';
import { passwordSchema } from '@/utils/zod';
import { z } from 'zod';
import { mapToken, tokenTypes } from './mappings/tokens';
import { mapExpandedUser } from './mappings/user';

export const registerRouter = makeRouter((app) => {
  app.post(
    '/api/auth/register',
    {
      schema: {
        description: 'Create user',
        body: z.object({
          email: z.string().min(1),
          password: passwordSchema(),
        }),
      },
    },
    handle(async ({ body, auth }) => {
      auth.can(permissions.user.create({}));
      const newUser = await prisma.user.create({
        data: {
          id: getId('usr'),
          email: body.email,
          passwordHash: await hashPassword(body.password),
        },
        include: {
          orgMembers: {
            include: {
              org: true,
            },
          },
        },
      });
      const session = await createSession(newUser);
      return {
        user: mapExpandedUser(newUser),
        token: mapToken(tokenTypes.session, makeSessionToken(session.id)),
      };
    }),
  );
});
