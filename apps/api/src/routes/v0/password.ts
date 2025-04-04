import { z } from 'zod';
import { prisma } from '@/modules/db';
import { handle } from '@/utils/handle';
import { makeRouter } from '@/utils/router';
import { ApiError, NotFoundError } from '@/utils/error';
import { timeout } from '@/utils/timeout';
import { resetPasswordEmail } from '@/modules/emails/templates/reset-password';
import { generateSecureKey, hashPassword } from '@/utils/auth/password';
import { createSession, makeSessionToken } from '@/utils/auth/session';
import { passwordSchema } from '@/utils/zod';
import { makeAuthToken, parseAuthToken } from '@/utils/auth/tokens';
import { makePasswordResetUrl } from '@/utils/urls';
import { mapSuccess } from '@/routes/v0/mappings/success';
import { mapExpandedUser } from '@/routes/v0/mappings/user';
import { mapToken, tokenTypes } from '@/routes/v0/mappings/tokens';

export const passwordAuthrouter = makeRouter((app) => {
  app.post(
    '/api/auth/password-reset',
    {
      schema: {
        description: 'Request password reset',
        body: z.object({
          email: z.string().min(1),
        }),
      },
    },
    handle(async ({ body }) => {
      // wait a few seconds, to prevent timing attacks
      const timeoutPromise = timeout(2000);

      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (!user) {
        await timeoutPromise;
        return { success: true }; // always return success, to prevent email enumeration
      }

      const token = makeAuthToken({
        t: 'passreset',
        stamp: user.securityStamp,
        uid: user.id,
      });

      try {
        await resetPasswordEmail.send({
          to: user.email,
          props: {
            resetLink: makePasswordResetUrl(token),
          },
        });
      } catch {
        // ignore all errors, we do not want to leak that it's a valid user email
      }

      await timeoutPromise;
      return mapSuccess();
    }),
  );

  app.post(
    '/api/auth/password-reset/submit',
    {
      schema: {
        description: 'Submit a password reset',
        body: z.object({
          token: z.string().min(1),
          newPassword: passwordSchema(),
        }),
      },
    },
    handle(async ({ body }) => {
      const parsedToken = parseAuthToken(body.token);
      if (!parsedToken || parsedToken.t !== 'passreset') throw ApiError.forCode('authInvalidToken');
      const userId = parsedToken.uid;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundError();
      if (user.securityStamp !== parsedToken.stamp) throw ApiError.forCode('authInvalidToken');

      const newUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          passwordHash: await hashPassword(body.newPassword),
          securityStamp: generateSecureKey(),
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
