import type { StatusPage, StatusPageMonitor } from "@prisma/client";
import type { ExternalMonitorDto, FullMonitor, MonitorDto } from "@/routes/v1/mappings/monitor";
import { mapExternalMonitor, mapMonitor } from "@/routes/v1/mappings/monitor";

export type StatusPageDto = {
  id: string;
  name: string;
  externalId: string;
  createdAt: string;
  orgId: string;
};

export type StatusPageMonitorDto = {
  id: string;
  createdAt: string;
  statusPageId: string;
  monitor: MonitorDto;
};

export type ExternalStatusPageDto = {
  id: string;
  name: string;
  externalId: string;
  orgId: string;
  monitors: ExternalMonitorDto[];
};

export function mapStatusPage(statusPage: StatusPage): StatusPageDto {
  return {
    id: statusPage.id,
    name: statusPage.name,
    orgId: statusPage.orgId,
    externalId: statusPage.externalId,
    createdAt: statusPage.createdAt.toISOString(),
  };
}

export function mapExternalStatusPage(statusPage: StatusPage & { statusPageMonitors: FullMonitor[] }): ExternalStatusPageDto {
  return {
    id: statusPage.id,
    name: statusPage.name,
    externalId: statusPage.externalId,
    orgId: statusPage.orgId,
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
