import type { IntervalResponse, PageControls, PageResponse, RangeResponse } from "~/api/common";
import type { EnumType } from "~/api/enums";

export const monitorTypes = {
  http: "http",
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export interface HttpMonitorResponse {
  id: string;
  allowedStatusCodes: RangeResponse[];
  expectedKeywords: string[];
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
