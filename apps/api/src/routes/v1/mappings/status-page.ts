import type { StatusPage } from "@prisma/client";

export interface StatusPageDto {
  id: string;
  name: string;
  externalId: string;
  createdAt: Date;
  orgId: string;
}

export function mapStatusPage(statusPage: StatusPage): StatusPageDto {
  return {
    id: statusPage.id,
    name: statusPage.name,
    externalId: statusPage.externalId,
    createdAt: statusPage.createdAt,
    orgId: statusPage.orgId,
  };
}
