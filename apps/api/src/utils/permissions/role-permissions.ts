import { all, type Permission } from './permission-builder';
import { permissions } from './permissions';
import type { AppRoles, OrgRoles } from './roles';

export const basePerms: Permission[] = [
  permissions.user.create({}),
];

export const baseUserPerms = (userId: string): Permission[] => [
  permissions.org.create({}),
  permissions.user.read({ usr: userId }),
  permissions.user.delete({ usr: userId }),
];

export const rolePerms: Record<AppRoles, Permission[]> = {
  'app:admin': [
    permissions.user.list({}),
    permissions.user.read({ usr: all }),
    permissions.org.list({}),
    permissions.org.delete({ org: all }),
  ],
};

export const orgRolePerms: Record<OrgRoles, (orgId: string) => Permission[]> = {
  'org:viewer': orgId => [
    permissions.org.read({ org: orgId }),
    permissions.org.member.read({ org: orgId, mbr: all }),
    permissions.org.member.list({ org: orgId }),
  ],
  'org:admin': orgId => [
    ...orgRolePerms['org:viewer'](orgId),

    permissions.org.delete({ org: orgId }),
    permissions.org.edit({ org: orgId }),
    permissions.org.member.create({ org: orgId }),
    permissions.org.member.edit({ org: orgId, mbr: all }),
    permissions.org.member.delete({ org: orgId, mbr: all }),
  ],
};
