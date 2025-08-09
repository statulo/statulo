import { refreshActiveAgent, registerActiveAgent, removeActiveAgent, removeStaleActiveAgents } from "@/modules/orchestrator/active-agents";
import { calculateCheckCost, getHeartbeat, hashChecks } from "@/modules/orchestrator/utils";
import { createActiveAgentToken } from "@/modules/orchestrator/tokens";
import { addCheckForMonitor, updateChecksForMonitor } from "@/modules/orchestrator/checks";

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
    updateChecks: updateChecksForMonitor,
    addCheck: addCheckForMonitor,
    calculateCost: calculateCheckCost,
    hash: hashChecks,
  },
};
