import type { OrgInvite, Organisation, User } from '@prisma/client';
import type { OrganisationDto } from './organisation';
import { mapOrganisation } from './organisation';
import type { UserDto } from '@/routes/v0/mappings/user';
import { mapUser } from '@/routes/v0/mappings/user';
import type { OrgRoles } from '@/utils/permissions/roles';

export interface OrgInviteDto {
  id: string;
  createdAt: string;
  org: OrganisationDto;
  user: UserDto | null;
  roles: OrgRoles[];
}

export function mapOrgInvite(invite: OrgInvite & { user: User | null; org: Organisation }): OrgInviteDto {
  return {
    id: invite.id,
    createdAt: invite.createdAt.toISOString(),
    user: invite.user ? mapUser(invite.user) : null,
    org: mapOrganisation(invite.org),
    roles: invite.roles as OrgRoles[],
  };
}
