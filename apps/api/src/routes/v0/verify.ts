import { prisma } from '@/modules/db';
import { emailVerificationUrlEmail } from '@/modules/emails/templates/email-verification-via-url';
import { mapUser } from '@/routes/v0/mappings/user';
import { parseAuthToken } from '@/utils/auth/tokens';
import { ApiError, NotFoundError } from '@/utils/error';
import { handle } from '@/utils/handle';
import { makeRouter } from '@/utils/router';
import { makeEmailVerificationUrl } from '@/utils/urls';
import { z } from 'zod';

export const verifyRouter = makeRouter((app) => {
  app.post('/api/auth/verify',
    {
      schema: {
        description: 'Verify users email',
        querystring: z.object({
          token: z.string(),
        }),
      },
    },
    handle(async ({ query }) => {
      const tokenData = parseAuthToken(query.token);
      if (tokenData?.t !== 'emailverify') throw ApiError.forCode('authInvalidToken');

      const user = await prisma.user.findUnique({
        where: {
          id: tokenData.uid,
        },
      });
      if (!user) throw new NotFoundError();

      // The security stamp will invalidate tokens if the user's email is changed
      if (user.securityStamp !== tokenData.stamp) {
        throw ApiError.forCode('authInvalidToken');
      }

      // Already verified, just return the user
      if (user.emailVerified) {
        return mapUser(user);
      }

      const newUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      return mapUser(newUser);
    }),
  );

  app.post('/api/auth/verify/resend',
    handle(async ({ auth, res }) => {
      auth.checkAuthentication();

      const user = auth.data.getUser();
      if (user.emailVerified) {
        throw ApiError.forCode('authEmailAlreadyVerified');
      }

      const verificationUrl = makeEmailVerificationUrl(user);
      await emailVerificationUrlEmail.send({
        props: {
          verificationLink: verificationUrl,
        },
        to: user.email,
      });

      res.status(204);
      return undefined;
    }),
  );
});
