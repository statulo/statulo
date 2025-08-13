import { createHash } from "crypto";
import type { CheckAssignment } from "@prisma/client";
import { intervalToMs, type Interval } from "@/utils/monitors/intervals";

const hashVersion = 1;

export type CheckCostOptions = {
  baseCost: number;
  interval: Interval;
};

export function calculateCheckCost(ops: CheckCostOptions): number {
  const range = 24 * 60 * 60 * 1000; // 1 day
  const checksInRange = range / intervalToMs(ops.interval); // checks per day
  const costInRange = checksInRange * ops.baseCost; // cost per day
  const scaledCostInRange = Math.floor(costInRange * 100); // Remove need for floats by scaling
  return scaledCostInRange;
}

export function hashChecks(checks: CheckAssignment[]): string {
  const baseString = checks.map(v => `${v.checkId}-${v.endAt?.getTime() ?? "null"}`).join(":");
  const hash = createHash("sha256").update(baseString).digest("hex");
  return `v${hashVersion}:${hash}`;
}

export function getHeartbeat(): number {
  return 10;
}

// Get the date from when the agents have become stale
export function getStaleHeartbeatDate(): Date {
  const allowedFailedHeartbeats = 2;
  const timeOffsetMs = (getHeartbeat() * allowedFailedHeartbeats) * 1000;
  return new Date(Date.now() - timeOffsetMs);
}

// Get the date from when the checks are safe to apply (has to do with stale agents)
export function getSafeStartDate(): Date {
  const amountHeartbeats = 3;
  const timeOffsetMs = (getHeartbeat() * amountHeartbeats) * 1000;
  return new Date(Date.now() + timeOffsetMs);
}
