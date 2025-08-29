import type { Check, CheckAssignment, ConnectedAgent } from "@prisma/client";
import { prisma } from "@/modules/db";
import { getId } from "@/utils/id";
import { getStaleHeartbeatDate } from "@/modules/orchestrator/utils";
import { logger } from "@/modules/log";
import { distributeCheck } from "@/modules/orchestrator/distribution";

export async function getActiveAgent(id: string): Promise<ConnectedAgent | null> {
  return await prisma.connectedAgent.findFirst({
    where: {
      id,
    },
  });
}

export async function registerActiveAgent(agentRegistrationId: string): Promise<ConnectedAgent> {
  return await prisma.connectedAgent.create({
    data: {
      id: getId("agt"),
      registrationId: agentRegistrationId,
    },
  });
}

export async function refreshActiveAgent(id: string): Promise<boolean> {
  const result = await prisma.connectedAgent.updateMany({
    where: {
      id,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
  return result.count > 0;
}

export async function removeActiveAgent(id: string): Promise<void> {
  await prisma.connectedAgent.delete({
    where: {
      id,
    },
  });
  // TODO register checkAssignments to different agent, use `endAt` to ease them over to the new agent
}

export async function removeStaleActiveAgents(): Promise<void> {
  const staleAgents = await prisma.connectedAgent.findMany({
    where: {
      lastSeenAt: {
        lte: getStaleHeartbeatDate(),
      },
    },
  });
  if (staleAgents.length > 0) {
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

  const orphanedChecks = await prisma.checkAssignment.findMany({
    where: {
      agentId: null,
      endAt: {
        gte: new Date(),
      },
    },
    include: {
      check: true,
    },
  });
  for (const checkAssignment of orphanedChecks) {
    await prisma.$transaction(async (tx) => {
      // TODO put it all on a single agent, so it's quicker and cheaper
      // It will rely on the daily cost rebalance to sort it out later
      await distributeCheck(tx, checkAssignment.check);
      await tx.checkAssignment.delete({
        where: {
          id: checkAssignment.id,
        },
      });
    });
  }
}

export type FullCheckAssignment = CheckAssignment & { check: Check };

export async function findChecksForAgent(agentId: string): Promise<FullCheckAssignment[]> {
  return await prisma.checkAssignment.findMany({
    where: {
      agentId,
    },
    include: {
      check: true,
    },
  });
}
