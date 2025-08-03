import type { Organisation } from "@prisma/client";

export type OrganisationDto = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type ExternalOrganisationDto = {
  id: string;
  name: string;
  description: string | null;
};

export function mapOrganisation(org: Organisation): OrganisationDto {
  return {
    id: org.id,
    name: org.name,
    description: org.description ?? null,
    createdAt: org.createdAt.toISOString(),
  };
}

export function mapExternalOrganisation(org: Organisation): ExternalOrganisationDto {
  return {
    id: org.id,
    name: org.name,
    description: org.description ?? null,
  };
}
