import type { ConnectedAgent } from "@prisma/client";
import { prisma } from "@/modules/db";
import { getId } from "@/utils/id";
import { getStaleHeartbeatDate } from "@/modules/orchestrator/utils";
import { logger } from "@/modules/log";

export async function registerActiveAgent(agentRegistrationId: string): Promise<ConnectedAgent> {
  return await prisma.connectedAgent.create({
    data: {
      id: getId("agt"),
      registrationId: agentRegistrationId,
    },
  });
}

export async function refreshActiveAgent(id: string): Promise<void> {
  await prisma.connectedAgent.update({
    where: {
      id,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
}

export async function removeActiveAgent(id: string): Promise<void> {
  await prisma.connectedAgent.delete({
    where: {
      id,
    },
  });
}

export async function removeStaleActiveAgents(): Promise<void> {
  const staleAgents = await prisma.connectedAgent.findMany({
    where: {
      lastSeenAt: {
        lte: getStaleHeartbeatDate(),
      },
    },
  });
  await prisma.connectedAgent.deleteMany({
    where: {
      id: {
        in: staleAgents.map(v => v.id),
      },
    },
  });
  staleAgents.forEach((agent) => {
    logger.warn(`Removed stale agent: ${agent.id} for ${agent.registrationId}`);
  });
}
