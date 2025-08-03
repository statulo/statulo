import { httpRequest } from "@/utils/http";

export type OrganisationDto = {
  id: string;
  name: string;
  description: string | null;
};

export function getOrganisationMeta(ref: string) {
  return httpRequest<OrganisationDto>("get", `/api/v1/organisations/${ref}/meta`);
}
