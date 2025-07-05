import { indexRouter } from "@/routes/v0";
import { authRouter } from "@/routes/v0/auth";
import { passwordAuthrouter } from "@/routes/v0/password";
import { registerRouter } from "@/routes/v0/register";
import { userRouter } from "@/routes/v1/users";
import { orgRouter } from "@/routes/v1/orgs";
import { orgMemberRouter } from "@/routes/v1/org-member";
import { orgInviteRouter } from "@/routes/v1/org-invites";
import { monitorRouter } from "@/routes/v1/monitors";
import { verifyRouter } from "@/routes/v0/verify";
import type { StatuloFastifyInstance } from "@/modules/fastify";
import { contactPointRouter } from "@/routes/v1/contact-points";
import { orchestratorRouter } from "@/routes/v1/orchestrator";

export async function setupRoutes(app: StatuloFastifyInstance) {
  await app.register(indexRouter.register);
  await app.register(authRouter.register);
  await app.register(passwordAuthrouter.register);
  await app.register(registerRouter.register);
  await app.register(verifyRouter.register);
  await app.register(userRouter.register);
  await app.register(orgRouter.register);
  await app.register(orgMemberRouter.register);
  await app.register(orgInviteRouter.register);
  await app.register(monitorRouter.register);
  await app.register(contactPointRouter.register);
  await app.register(orchestratorRouter.register);
}
