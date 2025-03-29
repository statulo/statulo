import { mapUserSideOrgMember, type UserSideOrgMemberDto } from '@/routes/v1/mappings/org-member';
import type { PopulatedUser } from '@/utils/permissions/resolve-roles';
import type { User } from '@prisma/client';

export type UserDto = {
  id: string;
  email: string;
  createdAt: string;
};

export type ExpandedUserDto = UserDto & {
  orgMembers: UserSideOrgMemberDto[];
};

export function mapUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export function mapExpandedUser(user: PopulatedUser): ExpandedUserDto {
  return {
    ...mapUser(user),
    orgMembers: user.orgMembers.map(v => mapUserSideOrgMember(v)),
  };
}
