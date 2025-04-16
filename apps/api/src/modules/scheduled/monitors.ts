// TODO this is a temporary test file
// This will not be used in the final product:
// - It is unreliable
// - It does not retry
// - It does not scale to multiple instances
// - It is inefficient
// - It does not do checks parralel
// So basically: please replace ASAP with a real system

import { prisma } from "@/modules/db";
import { logger } from "@/modules/log";
import type { Interval } from "@/utils/monitors/intervals";
import { intervalToMs } from "@/utils/monitors/intervals";
import type { HttpMonitor, Monitor } from "@prisma/client";

const lastExecuted = new Map<string, number>();

export async function executeHttpMonitor(monitor: HttpMonitor & { monitor: Monitor }) {
  try {
    await fetch(monitor.url);
    // TODO check keywords
    // TODO check allowed port ranges
    logger.info(`http/${monitor.id} is UP`);
  } catch (err) {
    logger.warn(`Failed to execute http/${monitor.id}`, err);
    return;
  }
}

export async function executeHttpMonitors() {
  const now = Date.now();
  const monitors = await prisma.httpMonitor.findMany({
    include: {
      monitor: true,
    },
  });

  for (const monitor of monitors) {
    const lastMonitorExecution = lastExecuted.get(monitor.id) ?? 0;
    const diff = now - lastMonitorExecution;
    if (diff < intervalToMs(monitor.interval as Interval))
      continue;
    lastExecuted.set(monitor.id, now);
    await executeHttpMonitor(monitor);
  }
}
