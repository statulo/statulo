import type { Check, Prisma } from "@prisma/client";
import { logger } from "@/modules/log";
import { getUntypedId } from "@/utils/id";

export async function redistributeChecks(): Promise<void> {
  // TODO Distribute checks among all active agents
}

function getCheckConstraintQuery(_check: Check): Prisma.ConnectedAgentWhereInput {
  return {}; // TODO add constraints (regions, groups, etc)
}

export async function distributeCheck(tx: Prisma.TransactionClient, check: Check): Promise<void> {
  const lowestAgents = await tx.connectedAgent.findMany({
    where: getCheckConstraintQuery(check),
    orderBy: {
      totalCost: "asc",
    },
    take: 3,
  });
  const bestAgentSorted = lowestAgents.map(v => ({
    id: v.id,
    costAfter: check.cost + v.totalCost,
  })).sort((a, b) => (a.costAfter - b.costAfter));
  const bestAgent = bestAgentSorted[0];
  if (!bestAgent) {
    logger.warn(`Check ${check.id} could not be distributed, no agents found`);
    return;
  }

  await tx.connectedAgent.update({
    where: {
      id: bestAgent.id,
    },
    data: {
      totalCost: {
        increment: check.cost,
      },
    },
  });
  await tx.checkAssignment.create({
    data: {
      id: getUntypedId(),
      startAt: new Date(),
      agentId: bestAgent.id,
      checkId: check.id,
    },
  });
}
