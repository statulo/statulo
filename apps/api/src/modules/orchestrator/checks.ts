import type { Prisma } from "@prisma/client";
import { httpMonitorConverter } from "@/modules/orchestrator/monitors/http";
import type { FullMonitor, MonitorConverter } from "@/modules/orchestrator/monitors/types";
import { getSafeStartDate } from "@/modules/orchestrator/utils";
import { getUntypedId } from "@/utils/id";
import { distributeCheck } from "@/modules/orchestrator/distribution";

const converters: MonitorConverter[] = [
  httpMonitorConverter,
];

// TODO handle check deletions (through org del, monitor del)

function getConverter(monitor: FullMonitor): MonitorConverter {
  const found = converters.find(v => v.type === monitor.type);
  if (!found) throw new Error("No monitor converter found");
  return found;
}

export async function updateChecksForMonitor(prisma: Prisma.TransactionClient, oldMonitor: FullMonitor, newMonitor: FullMonitor): Promise<void> {
  const converter = getConverter(newMonitor);
  const checkResult = converter.toUpdatedChecks(oldMonitor, newMonitor);
  const startDate = getSafeStartDate();

  // Stop removed checks as soon as possible
  await prisma.check.updateMany({
    where: {
      correlationId: {
        in: checkResult.removed.map(v => v.correlationId),
      },
      endAt: null,
    },
    data: {
      endAt: new Date(),
    },
  });

  // End current checks at the start date for updated or new checks
  await prisma.check.updateMany({
    where: {
      correlationId: {
        in: checkResult.updatedOrNew.map(v => v.correlationId),
      },
      endAt: null,
    },
    data: {
      endAt: startDate,
    },
  });
  const newChecks: Prisma.CheckCreateManyInput[] = checkResult.updatedOrNew.map(v => ({
    id: getUntypedId(),
    version: v.version,
    cost: v.cost,
    correlationId: v.correlationId,
    monitorId: v.monitorId,
    type: v.type,
    startAt: startDate,
    body: v.body,
    interval: v.interval,
  }));
  const createdChecks = await prisma.check.createManyAndReturn({
    data: newChecks,
  });

  // Distribute new checks to agents
  for (const check of createdChecks) {
    await distributeCheck(prisma, check);
  }
}

export async function addCheckForMonitor(prisma: Prisma.TransactionClient, monitor: FullMonitor): Promise<void> {
  const converter = getConverter(monitor);
  const checkResult = converter.toChecks(monitor);
  const startDate = getSafeStartDate();

  const newChecks: Prisma.CheckCreateManyInput[] = checkResult.map(v => ({
    id: getUntypedId(),
    version: v.version,
    cost: v.cost,
    correlationId: v.correlationId,
    monitorId: v.monitorId,
    type: v.type,
    startAt: startDate,
    body: v.body,
    interval: v.interval,
  }));
  const createdChecks = await prisma.check.createManyAndReturn({
    data: newChecks,
  });

  // Distribute new checks to agents
  for (const check of createdChecks) {
    await distributeCheck(prisma, check);
  }
}
