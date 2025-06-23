import type { PageControls, PageResponse } from "~/api/common";
import type { OrgRoles } from "~/api/enums";
import type { UserResponse } from "~/api/users";

export interface OrgMemberResponse {
  id: string;
  createdAt: string;
  orgId: string;
  user: UserResponse;
  roles: OrgRoles[];
}

export function listMembers(orgId: string, page: PageControls) {
  return httpRequest<PageResponse<OrgMemberResponse>>("get", `/api/v1/organisations/${orgId}/members`, {
    query: page,
  });
}

export function removeMember(orgId: string, id: string) {
  return httpRequest<void>("delete", `/api/v1/organisations/${orgId}/members/${id}`, {
  });
}
