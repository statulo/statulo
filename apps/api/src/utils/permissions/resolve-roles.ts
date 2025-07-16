import type { Organisation, OrgMember, User } from "@prisma/client";
import type { Permission } from "@/utils/permissions/permission-builder";
import { basePerms, baseUserPerms, orgRolePerms, rolePerms } from "@/utils/permissions/role-permissions";
import type { AppRoles, OrgRoles } from "@/utils/permissions/roles";
import { permissions } from "@/utils/permissions/permissions";

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
  activeAgentId?: string;
  agentRegistrationId?: string;
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

  if (context.agentRegistrationId) out = [
    ...out,
    permissions.activeAgent.internal.register({}),
  ];
  if (context.activeAgentId) out = [
    ...out,
    permissions.activeAgent.internal.manage({ id: context.activeAgentId }),
  ];

  return out;
}
