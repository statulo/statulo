import type { IntervalResponse, PageControls, PageResponse, RangeResponse } from "~/api/common";
import type { ContactPointResponse } from "~/api/contactPoints";
import type { EnumType } from "~/api/enums";

export const monitorTypes = {
  http: "http",
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export interface HttpMonitorResponse {
  id: string;
  allowedStatusCodes: RangeResponse[];
  expectedKeywords: string[];
  url: string;
  interval: IntervalResponse;
}

export interface MonitorCreateRequest {
  type: MonitorTypes;
  name: string | null;
  contactPointIds: string[];
  data: {
    // http
    url: string;
    interval: IntervalResponse;
    allowedStatusCodes: RangeResponse[];
    expectedKeywords: string[];
  };
}

export interface MonitorEditRequest {
  type: MonitorTypes;
  name?: string | null;
  contactPointIds?: string[];
  data: {
    // http
    url?: string;
    interval?: IntervalResponse;
    allowedStatusCodes?: RangeResponse[];
    expectedKeywords?: string[];
  };
}

export interface MonitorResponse {
  id: string;
  type: MonitorTypes;
  createdAt: string;
  name: string | null;
  computedName: string;
  primaryInterval: IntervalResponse | null;
  http: HttpMonitorResponse | null;
}

export interface ShallowMonitorResponse {
  id: string;
  type: MonitorTypes;
  createdAt: string;
  name: string | null;
  computedName: string;
  primaryInterval: IntervalResponse | null;
}

export function listMonitors(orgId: string, page: PageControls) {
  return httpRequest<PageResponse<ShallowMonitorResponse>>("get", `/api/v1/organisations/${orgId}/monitors`, {
    query: page,
  });
}

export function createMonitor(orgId: string, body: MonitorCreateRequest) {
  return httpRequest<MonitorResponse>("post", `/api/v1/organisations/${orgId}/monitors`, {
    body,
  });
}

export function getMonitor(id: string) {
  return httpRequest<MonitorResponse>("get", `/api/v1/monitors/${id}`);
}

export function deleteMonitor(id: string) {
  return httpRequest<void>("delete", `/api/v1/monitors/${id}`);
}

export function editMonitor(id: string, body: MonitorEditRequest) {
  return httpRequest<void>("patch", `/api/v1/monitors/${id}`, {
    body,
  });
}

export function getMonitorContactPoints(id: string, page: PageControls) {
  return httpRequest<PageResponse<ContactPointResponse>>("get", `/api/v1/monitors/${id}/contact-points`, {
    query: page,
  });
}
