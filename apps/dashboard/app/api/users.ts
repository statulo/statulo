import type { OrgRoles } from "~/api/enums";

export interface OrganisationResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface UserSideOrgMemberResponse {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
  org: OrganisationResponse;
  roles: OrgRoles[];
}

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
