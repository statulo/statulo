import type { HttpMonitor } from "@prisma/client";
import type { CheckDefinition } from "@/modules/orchestrator/checks/types";

const type = "http";

function buildCorrelationId(monitor: HttpMonitor, segment: string): string {
  return `${monitor.monitorId}/${segment}`;
}

export function buildHttpCheck(monitor: HttpMonitor): CheckDefinition {
  return {
    type,
    monitorId: monitor.monitorId,
    correlationId: buildCorrelationId(monitor, "http"),
    version: 1,
    cost: 50,
  };
}
