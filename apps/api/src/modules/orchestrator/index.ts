import { refreshActiveAgent, registerActiveAgent, removeActiveAgent, removeStaleActiveAgents } from "@/modules/orchestrator/active-agents";
import { calculateCheckCost, hashChecks } from "@/modules/orchestrator/utils";
import { createActiveAgentToken, parseActiveAgentToken } from "@/modules/orchestrator/tokens";

export const orchestrator = {
  agents: {
    register: registerActiveAgent,
    refresh: refreshActiveAgent,
    remove: removeActiveAgent,
    processStale: removeStaleActiveAgents,
  },
  tokens: {
    create: createActiveAgentToken,
    parse: parseActiveAgentToken,
  },
  checks: {
    calculateCost: calculateCheckCost,
    hash: hashChecks,
  },
};
