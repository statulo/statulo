import { httpRequest } from "@/utils/http";
import type { Interval } from "@/api/intervals";
import type { EnumType } from "@/utils/types";

export const monitorTypes = {
  http: "http",
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export type MonitorDto = {
  id: string;
  type: MonitorTypes;
  name: string | null;
  computedName: string;
  primaryInterval: Interval | null;
};

export type StatusPageDto = {
  id: string;
  name: string;
  externalId: string;
  monitors: MonitorDto[];
};

export function getStatusPageStatus(ref: string) {
  return httpRequest<StatusPageDto>("get", `/api/v1/status-pages/${ref}/status`);
}
