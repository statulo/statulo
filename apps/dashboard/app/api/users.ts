import type { OrgRoles } from "~/api/enums";
import type { OrganisationResponse } from "~/api/orgs";

export type UserSideOrgMemberResponse = {
  id: string;
  createdAt: string;
  userId: string;
  org: OrganisationResponse;
  roles: OrgRoles[];
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  emailVerified: boolean;
};

export type ExpandedUserResponse = UserResponse & {
  orgMembers: UserSideOrgMemberResponse[];
};

export type UserSecuritySettingsRequest = {
  email?: {
    newEmail: string;
    code: string;
  };
  password?: {
    oldPassword: string;
    newPassword: string;
  };
};

export type OrgInviteInfoResponse = {
  id: string;
  createdAt: string;
  org: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function getMe() {
  return httpRequest<ExpandedUserResponse>("get", "/api/v1/users/@me");
}

export function editUserSecuritySettings(
  userId: string,
  body: UserSecuritySettingsRequest,
) {
  return httpRequest<ExpandedUserResponse>("patch", `/api/v1/users/${userId}/security`, {
    body,
  });
}

export function listUserInvites(
  userId: string,
) {
  return httpRequest<OrgInviteInfoResponse[]>("get", `/api/v1/users/${userId}/org-invites`);
}

export function verifyEmailByToken(
  token: string,
) {
  return httpRequest<void>("post", `/api/auth/verify`, {
    query: {
      token,
    },
  });
}
