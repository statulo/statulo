import type { StatusPage, StatusPageMonitor } from "@prisma/client";
import type { ExternalMonitorDto, FullMonitor, MonitorDto } from "@/routes/v1/mappings/monitor";
import { mapExternalMonitor, mapMonitor } from "@/routes/v1/mappings/monitor";

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

export interface ExternalStatusPageDto {
  id: string;
  name: string;
  externalId: string;
  monitors: ExternalMonitorDto[];
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

export function mapExternalStatusPage(statusPage: StatusPage & { statusPageMonitors: FullMonitor[] }): ExternalStatusPageDto {
  return {
    id: statusPage.id,
    name: statusPage.name,
    externalId: statusPage.externalId,
    monitors: statusPage.statusPageMonitors.map(mapExternalMonitor),
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
