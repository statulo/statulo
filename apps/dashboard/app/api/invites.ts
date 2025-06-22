import type { OrgRoles } from "~/api/enums";
import type { OrgInviteInfoResponse, UserResponse } from "~/api/users";

export interface OrgMemberResponse {
  id: string;
  createdAt: string;
  orgId: string;
  user: UserResponse;
  roles: OrgRoles[];
}

export function getInviteInfoByToken(
  token: string,
) {
  return httpRequest<OrgInviteInfoResponse>("get", `/api/v1/org-invites/accept`, {
    query: {
      token,
    },
  });
}

export function acceptInviteInfoByToken(
  token: string,
) {
  return httpRequest<OrgMemberResponse>("post", `/api/v1/org-invites/accept`, {
    body: {
      token,
    },
  });
}
