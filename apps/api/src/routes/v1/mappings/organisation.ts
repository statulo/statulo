import type { Organisation } from '@prisma/client';

export interface OrganisationDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export function mapOrganisation(org: Organisation): OrganisationDto {
  return {
    id: org.id,
    name: org.name,
    description: org.description ?? null,
    createdAt: org.createdAt.toISOString(),
  };
}
