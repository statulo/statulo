import type { Organisation, OrgMember, User } from '@prisma/client';
import type { Permission } from './permission-builder';
import { basePerms, baseUserPerms, orgRolePerms, rolePerms } from './role-permissions';
import type { AppRoles, OrgRoles } from './roles';

type PopulatedOrgMember = OrgMember & { org: Organisation };
export type PopulatedUser = User & {
  orgMembers: PopulatedOrgMember[];
};

function resolveOrgRolesForOrgMember(member: OrgMember): Permission[] {
  return member.roles.flatMap(v => orgRolePerms[v as OrgRoles]?.(member.orgId) ?? []);
}

function resolvePermissionsforUser(user: PopulatedUser): Permission[] {
  const appRolePerms = user.roles.flatMap(v => rolePerms[v as AppRoles] ?? []);

  return [
    baseUserPerms(user.id),
    appRolePerms,
    ...user.orgMembers.map(member =>
      resolveOrgRolesForOrgMember(member),
    ),
  ].flat();
}

export type PermissionContext = {
  user?: PopulatedUser;
};

export function getPermissions(
  context: PermissionContext,
): Permission[] {
  let out: Permission[] = [
    ...basePerms,
  ];
  if (context.user) out = [
    ...out,
    ...resolvePermissionsforUser(context.user),
  ];
  return out;
}
