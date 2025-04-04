import type { OrgMember, Organisation, User } from '@prisma/client';
import type { UserDto } from '@/routes/v0/mappings/user';
import { mapUser } from '@/routes/v0/mappings/user';
import type { OrgRoles } from '@/utils/permissions/roles';
import { mapOrganisation, type OrganisationDto } from '@/routes/v1/mappings/organisation';

export interface UserSideOrgMemberDto {
  id: string;
  createdAt: string;
  userId: string;
  org: OrganisationDto;
  roles: OrgRoles[];
}

export interface OrgMemberDto {
  id: string;
  createdAt: string;
  orgId: string;
  user: UserDto;
  roles: OrgRoles[];
}

export function mapOrgMember(member: OrgMember & { user: User }): OrgMemberDto {
  return {
    id: member.id,
    createdAt: member.createdAt.toISOString(),
    orgId: member.orgId,
    user: mapUser(member.user),
    roles: member.roles as OrgRoles[],
  };
}

export function mapUserSideOrgMember(
  member: OrgMember & { org: Organisation },
): UserSideOrgMemberDto {
  return {
    id: member.id,
    createdAt: member.createdAt.toISOString(),
    org: mapOrganisation(member.org),
    userId: member.userId,
    roles: member.roles as OrgRoles[],
  };
}
