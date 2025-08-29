import { prisma } from "@/modules/db";

export const agent = {
  id: "test",
  token: "test",
};

export async function seedAgents() {
  await prisma.agentRegistration.createMany({
    data: [
      {
        id: agent.id,
        token: agent.token,
      },
    ],
  });
}
