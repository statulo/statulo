import type { HttpMonitor, Monitor, Prisma } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/client";
import { monitorTypes, type MonitorTypes } from "@/routes/v1/monitors";
import type { Interval } from "@/utils/monitors/intervals";
import { stringRangeToObject, type Range } from "@/utils/monitors/ranges";

export interface HttpMonitorDto {
  id: string;
  allowedStatusCodes: Range[];
  expectedKeywords: string[];
}

export interface MonitorDto {
  id: string;
  type: MonitorTypes;
  createdAt: string;
  name: string | null;
  computedName: string;
  primaryInterval: Interval | null;
  http: HttpMonitorDto | null;
}

export interface ShallowMonitorDto {
  id: string;
  type: MonitorTypes;
  createdAt: string;
  name: string | null;
  computedName: string;
  primaryInterval: Interval | null;
}

export interface ExternalMonitorDto {
  id: string;
  type: MonitorTypes;
  name: string | null;
  computedName: string;
  primaryInterval: Interval | null;
}

export type FullMonitor = Prisma.MonitorGetPayload<{
  include: {
    http: true;
  };
}>;

export type ShallowMonitorInput = Monitor & { http: { url: string; id: string; interval: JsonValue } | null };

function mapHttpMonitor(monitor: HttpMonitor): HttpMonitorDto {
  return {
    id: monitor.id,
    allowedStatusCodes: monitor.allowedStatusCodes.map(v => stringRangeToObject(v)),
    expectedKeywords: monitor.expectedKeywords,
  };
}

function mapComputedName(monitor: ShallowMonitorInput): string {
  if (monitor.type === monitorTypes.http && monitor.http)
    return monitor.http.url;
  return "Unknown";
}

function mapPrimaryInterval(monitor: ShallowMonitorInput): Interval | null {
  if (monitor.type === monitorTypes.http && monitor.http)
    return monitor.http.interval as Interval;
  return null;
}

export function mapMonitor(monitor: FullMonitor): MonitorDto {
  return {
    id: monitor.id,
    type: monitor.type as MonitorTypes,
    name: monitor.name,
    computedName: mapComputedName(monitor),
    primaryInterval: mapPrimaryInterval(monitor),
    createdAt: monitor.createdAt.toISOString(),
    http: monitor.type === monitorTypes.http && monitor.http ? mapHttpMonitor(monitor.http) : null,
  };
}

export function mapShallowMonitor(monitor: ShallowMonitorInput): ShallowMonitorDto {
  return {
    id: monitor.id,
    type: monitor.type as MonitorTypes,
    name: monitor.name,
    computedName: mapComputedName(monitor),
    primaryInterval: mapPrimaryInterval(monitor),
    createdAt: monitor.createdAt.toISOString(),
  };
}

export function mapExternalMonitor(monitor: FullMonitor): ExternalMonitorDto {
  return {
    id: monitor.id,
    type: monitor.type as MonitorTypes,
    name: monitor.name,
    computedName: mapComputedName(monitor),
    primaryInterval: mapPrimaryInterval(monitor),
  };
}
