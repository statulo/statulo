export type CreateOrgansationRequest = {
  name: string;
  description: string | null;
};

export interface OrganisationResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export function createOrganisation(body: CreateOrgansationRequest) {
  return httpRequest<OrganisationResponse>("post", `/api/v1/organisations`, {
    body,
  });
}
