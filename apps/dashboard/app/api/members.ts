import type { PageControls, PageResponse } from "~/api/common";
import type { OrgRoles } from "~/api/enums";
import type { OrganisationResponse } from "~/api/orgs";
import type { UserResponse } from "~/api/users";

export interface OrgMemberResponse {
  id: string;
  createdAt: string;
  orgId: string;
  user: UserResponse;
  roles: OrgRoles[];
}

export interface OrgInviteResponse {
  id: string;
  createdAt: string;
  org: OrganisationResponse;
  user: UserResponse | null;
  email: string;
  roles: OrgRoles[];
}

export interface InviteMemberInput {
  email: string;
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

export function inviteMember(orgId: string, body: InviteMemberInput) {
  return httpRequest<OrgInviteResponse>("post", `/api/v1/organisations/${orgId}/org-invites`, {
    body,
  });
}

export function listInvites(orgId: string, page: PageControls) {
  return httpRequest<PageResponse<OrgInviteResponse>>("get", `/api/v1/organisations/${orgId}/org-invites`, {
    query: page,
  });
}

export function cancelInvite(orgId: string, id: string) {
  return httpRequest<void>("delete", `/api/v1/organisations/${orgId}/org-invites/${id}`);
}
