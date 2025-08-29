import type { Check, Prisma } from "@prisma/client";
import { logger } from "@/modules/log";
import { getUntypedId } from "@/utils/id";

// Rebalance costs of all checks across the running agents
export async function rebalanceCosts(): Promise<void> {
  // - Get all checks and agents (only assigned checks and non-empty agents)
  // - Check for empty agents - if there is more than X% of agents empty, do a full rebalance (rebalance irrespective of current load)
  //   - Assign checks in order or cost (heavy to light)
  //   - Where check assignments already exist:
  //     - Find all checks with the same cost and constraints, work out a "checks per agent" number
  //     - For each agent, find the total number of each check in the same group, and rebalance ones which have a longest time since last rebalance or random if all are equal
  // - Get the total cost per agent
  // - Calculate the average cost of agents
  // - Calculate the standard deviation of the costs
  // - For each agent, if the cost is more than 1.5 std deviations from mean, mark it for rebalancing
  //   - Agents more than mean will be put into the heavy pool
  //   - Agents less than mean will be put into the light pool
  // - Go through the heavy pool and find checks that can be moved to light pool agents
  //   - Prefer moving larger cost checks first
  //   - Add a migration cost for checks that were rebalanced recently (i.e. penalty = cost * (1 + (time since last rebalance / rebalance period)))
  //     - Discourages moving checks too often, but allow it if the agent is overloaded
  // - Checks can only be moved according to their constraints (regions, groups, etc) (NOT MVP) (average changes per constraint)

  // TODO Distribute checks among all active agents
}

// Recover unassigned checks (checks created while the system was in a faulted state)
export async function reconcileChecks(): Promise<void> {
  // - Perform a staleness check on all check assignments
  // - Get all unassigned checks
  // - Assign them to the agents with the lowest cost

  // - Get all agents and their cost
  // - Calculate the average cost per agent of assigned checks
  // - Calculate total cost of all checks
  // - Calculate the target cost per agent (total cost / number of agents)
  // - Make a list of all the heavy agents (cost > target cost) and light agents (cost < target cost)
  // - Spread the unassigned checks across the light agents (cost < target cost)

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
