import type { User } from "@prisma/client";
import { mapUserSideOrgMember, type UserSideOrgMemberDto } from "@/routes/v1/mappings/org-member";
import type { PopulatedUser } from "@/utils/permissions/resolve-roles";

export type UserDto = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  emailVerified: boolean;
};

export type ExpandedUserDto = UserDto & {
  orgMembers: UserSideOrgMemberDto[];
};

export function mapUser(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    emailVerified: user.emailVerified,
  };
}

export function mapExpandedUser(user: PopulatedUser): ExpandedUserDto {
  return {
    ...mapUser(user),
    orgMembers: user.orgMembers.map(v => mapUserSideOrgMember(v)),
  };
}
