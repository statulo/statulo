import { refreshActiveAgent, registerActiveAgent, removeActiveAgent, removeStaleActiveAgents } from "@/modules/orchestrator/active-agents";
import { calculateCheckCost, getHeartbeat, hashChecks } from "@/modules/orchestrator/utils";
import { createActiveAgentToken } from "@/modules/orchestrator/tokens";

export const orchestrator = {
  agents: {
    register: registerActiveAgent,
    refresh: refreshActiveAgent,
    remove: removeActiveAgent,
    processStale: removeStaleActiveAgents,
  },
  heartbeat: {
    get: getHeartbeat,
  },
  tokens: {
    create: createActiveAgentToken,
  },
  checks: {
    calculateCost: calculateCheckCost,
    hash: hashChecks,
  },
};
