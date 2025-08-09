import type { Prisma } from "@prisma/client";
import type { CheckDefinition } from "@/modules/orchestrator/checks/types";
import type { EnumType } from "@/utils/types";

export const monitorTypes = {
  http: "http",
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export type FullMonitor = Prisma.MonitorGetPayload<{
  include: {
    http: true;
  };
}>;

export type CheckResult = {
  removed: { correlationId: string }[];
  updatedOrNew: CheckDefinition[];
};

export type MonitorConverter = {
  type: MonitorTypes;
  toChecks(monitor: FullMonitor): CheckDefinition[];
  toUpdatedChecks(oldMonitor: FullMonitor, newMonitor: FullMonitor): CheckResult;
};
