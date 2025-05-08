import type { OrgRoles } from "~/api/enums";

export interface OrganisationResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface UserSideOrgMemberResponse {
  id: string;
  createdAt: string;
  userId: string;
  org: OrganisationResponse;
  roles: OrgRoles[];
}

export type UserResponse = {
  id: string;
  email: string;
  createdAt: string;
  emailVerified: boolean;
};

export type ExpandedUserResponse = UserResponse & {
  orgMembers: UserSideOrgMemberResponse[];
};

export function getMe() {
  return httpRequest<ExpandedUserResponse>("get", "/api/v1/users/@me");
}
