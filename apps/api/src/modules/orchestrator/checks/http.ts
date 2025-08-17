import type { HttpMonitor } from "@prisma/client";
import type { CheckDefinition } from "@/modules/orchestrator/checks/types";
import type { Interval } from "@/utils/monitors/intervals";
import { intervalToMs } from "@/utils/monitors/intervals";
import { calculateCheckCost } from "@/modules/orchestrator/utils";

const type = "http";
const baseCost = 50;

function buildCorrelationId(monitor: HttpMonitor, segment: string): string {
  return `${monitor.monitorId}/${segment}`;
}

export type HttpCheckBodyV1 = {
  expectedKeywords: string[];
  allowedStatusCodes: string[];
  url: string;
};

export function buildHttpCheck(monitor: HttpMonitor): CheckDefinition {
  const body: HttpCheckBodyV1 = {
    expectedKeywords: monitor.expectedKeywords,
    allowedStatusCodes: monitor.allowedStatusCodes,
    url: monitor.url,
  };
  return {
    type,
    monitorId: monitor.monitorId,
    correlationId: buildCorrelationId(monitor, "http"),
    version: 1,
    interval: intervalToMs(monitor.interval as Interval),
    cost: calculateCheckCost({
      baseCost,
      interval: monitor.interval as Interval,
    }),
    body,
  };
}
