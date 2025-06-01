import type { EnumType } from "~/api/enums";

export const monitorTypes = {
  http: "http",
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export type IntervalResponse = {
  unit: "d" | "h" | "m" | "s";
  amount: number;
};

export type PageResponse<T> = {
  data: T[];
  total: number;
  offset: number;
  count: number;
};

export type RangeResponse = {
  from: number;
  to: number;
};

export interface HttpMonitorResponse {
  id: string;
  allowedStatusCodes: RangeResponse[];
  expectedKeywords: string[];
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

export type PageControls = {
  limit: number;
  offset: number;
};

export function listMonitors(orgId: string, page: PageControls) {
  return httpRequest<PageResponse<ShallowMonitorResponse>>("get", `/api/v1/organisations/${orgId}/monitors`, {
    query: page,
  });
}
