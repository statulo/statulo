import type { FastifyInstance } from 'fastify';
import { indexRouter } from '@/routes/v0';
import { authRouter } from '@/routes/v0/auth';
import { passwordAuthrouter } from '@/routes/v0/password';
import { registerRouter } from '@/routes/v0/register';
import { userRouter } from '@/routes/v1/users';
import { orgRouter } from '@/routes/v1/orgs';
import { orgMemberRouter } from '@/routes/v1/org-member';

export async function setupRoutes(app: FastifyInstance) {
  await app.register(indexRouter.register);
  await app.register(authRouter.register);
  await app.register(passwordAuthrouter.register);
  await app.register(registerRouter.register);
  await app.register(userRouter.register);
  await app.register(orgRouter.register);
  await app.register(orgMemberRouter.register);
}
