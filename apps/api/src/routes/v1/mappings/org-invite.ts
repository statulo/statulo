import type { OrgInvite, Organisation, User } from "@prisma/client";
import type { OrganisationDto } from "./organisation";
import { mapOrganisation } from "./organisation";
import type { UserDto } from "@/routes/v0/mappings/user";
import { mapUser } from "@/routes/v0/mappings/user";
import type { OrgRoles } from "@/utils/permissions/roles";

export type OrgInviteDto = {
  id: string;
  createdAt: string;
  org: OrganisationDto;
  user: UserDto | null;
  email: string;
  roles: OrgRoles[];
};

export type OrgInviteInfoDto = {
  id: string;
  createdAt: string;
  org: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function mapOrgInvite(invite: OrgInvite & { user: User | null; org: Organisation }): OrgInviteDto {
  return {
    id: invite.id,
    createdAt: invite.createdAt.toISOString(),
    user: invite.user ? mapUser(invite.user) : null,
    email: invite.email,
    org: mapOrganisation(invite.org),
    roles: invite.roles as OrgRoles[],
  };
}

export function mapOrgInviteInfo(invite: OrgInvite & { org: Organisation }): OrgInviteInfoDto {
  return {
    id: invite.id,
    createdAt: invite.createdAt.toISOString(),
    org: {
      id: invite.org.id,
      name: invite.org.name,
      description: invite.org.description,
    },
  };
}
