export function calculateCheckCost(_check: any): number {
  // calculate cost of the check
  return 0;
}

export function hashChecks(_checks: any[]): string {
  // Hash all checks
  return "";
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
