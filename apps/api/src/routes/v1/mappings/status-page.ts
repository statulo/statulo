import type { StatusPage, StatusPageMonitor } from "@prisma/client";
import type { MonitorDto } from "@/routes/v1/mappings/monitor";
import { mapMonitor } from "@/routes/v1/mappings/monitor";
import type { FullMonitor } from "@/modules/orchestrator/monitors/types";

export interface StatusPageDto {
  id: string;
  name: string;
  externalId: string;
  createdAt: string;
  orgId: string;
}

export interface StatusPageMonitorDto {
  id: string;
  createdAt: string;
  statusPageId: string;
  monitor: MonitorDto;
}

export function mapStatusPage(statusPage: StatusPage): StatusPageDto {
  return {
    id: statusPage.id,
    name: statusPage.name,
    externalId: statusPage.externalId,
    createdAt: statusPage.createdAt.toISOString(),
    orgId: statusPage.orgId,
  };
}

export function mapStatusPageMonitor(statusPageMonitor: StatusPageMonitor & { monitor: FullMonitor }): StatusPageMonitorDto {
  return {
    id: statusPageMonitor.id,
    createdAt: statusPageMonitor.createdAt.toISOString(),
    statusPageId: statusPageMonitor.statusPageId,
    monitor: mapMonitor(statusPageMonitor.monitor),
  };
}
