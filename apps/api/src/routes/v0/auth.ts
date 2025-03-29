import { z } from 'zod';
import { prisma } from '@/modules/db';
import { handle } from '@/utils/handle';
import { ApiError, NotFoundError } from '@/utils/error';
import { makeRouter } from '@/utils/router';
import { timeout } from '@/utils/timeout';
import { mapToken, tokenTypes } from './mappings/tokens';
import { mapSuccess } from './mappings/success';

export const authRouter = makeRouter((app) => {
  app.post(
    '/api/auth/login',
    {
      schema: {
        description: 'Login user',
        body: z.object({
          email: z.string().min(1),
          password: z.string().min(1),
        }),
      },
    },
    handle(async ({ body }) => {
      // wait a few seconds on error, to prevent timing attacks
      const timeoutPromise = timeout(2000);

      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
        include: {
          orgMembers: {
            include: {
              org: true,
            },
          },
        },
      });
      if (!user) {
        await timeoutPromise;
        throw ApiError.forCode('authInvalidInput', 400);
      }
      if (!(await verifyPassword(user.passwordHash, body.password))) {
        await timeoutPromise;
        throw ApiError.forCode('authInvalidInput', 400);
      }

      const session = await createSession(user);
      return {
        user: mapExpandedUser(user),
        token: mapToken(tokenTypes.session, session.id),
      };
    }),
  );

  app.post(
    '/api/v1/auth/logout',
    {
      schema: {
        description: 'Logout user',
      },
    },
    handle(async ({ auth }) => {
      auth.check(c => c.isAuthType('session'));
      const id = auth.data.getSession().id;

      const oldSessions = await prisma.userSession.deleteMany({
        where: {
          id,
        },
      });
      if (oldSessions.count === 0) throw new NotFoundError();
      return mapSuccess();
    }),
  );
});
