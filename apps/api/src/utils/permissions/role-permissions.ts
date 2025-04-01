import { all, type Permission } from './permission-builder';
import { permissions } from './permissions';
import type { AppRoles, OrgRoles } from './roles';

export const basePerms: Permission[] = [
  permissions.user.create({}),
];

export const baseUserPerms = (user: string): Permission[] => [
  permissions.org.create({}),
  permissions.user.read({ usr: user }),
  permissions.user.delete({ usr: user }),
];

export const rolePerms: Record<AppRoles, Permission[]> = {
  'app:admin': [
    permissions.user.list({}),
    permissions.user.read({ usr: all }),
    permissions.org.list({}),
    permissions.org.delete({ org: all }),
  ],
};

export const orgRolePerms: Record<OrgRoles, (org: string) => Permission[]> = {
  'org:viewer': org => [
    permissions.org.read({ org }),
    permissions.org.member.read({ org, mbr: all }),
    permissions.org.member.list({ org }),
  ],
  'org:admin': org => [
    ...orgRolePerms['org:viewer'](org),

    permissions.org.delete({ org }),
    permissions.org.edit({ org }),
    permissions.org.member.create({ org }),
    permissions.org.member.edit({ org, mbr: all }),
    permissions.org.member.delete({ org, mbr: all }),
  ],
};
