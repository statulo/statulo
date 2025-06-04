import { all, type Permission } from "@/utils/permissions/permission-builder";
import { permissions } from "@/utils/permissions/permissions";
import type { AppRoles, OrgRoles } from "@/utils/permissions/roles";

export const basePerms: Permission[] = [
  permissions.user.create({}),
];

export const baseUserPerms = (userId: string): Permission[] => [
  permissions.org.create({}),
  permissions.user.read({ usr: userId }),
  permissions.user.edit({ usr: userId }),
  permissions.user.delete({ usr: userId }),
  permissions.user.orgInvites.list({ usr: userId }),
];

export const rolePerms: Record<AppRoles, Permission[]> = {
  "app:admin": [
    permissions.user.list({}),
    permissions.user.read({ usr: all }),
    permissions.user.orgInvites.list({ usr: all }),
    permissions.org.list({}),
    permissions.org.delete({ org: all }),
  ],
};

export const orgRolePerms: Record<OrgRoles, (orgId: string) => Permission[]> = {
  "org:viewer": orgId => [
    permissions.org.read({ org: orgId }),
    permissions.org.member.read({ org: orgId, mbr: all }),
    permissions.org.member.list({ org: orgId }),
    permissions.org.invite.list({ org: orgId }),
    permissions.org.monitor.read({ org: orgId, mtr: all }),
    permissions.org.monitor.list({ org: orgId }),
    permissions.org.contactPoint.read({ org: orgId, con: all }),
    permissions.org.contactPoint.list({ org: orgId }),
    permissions.org.statusPage.read({ org: orgId, stspg: all }),
    permissions.org.statusPage.list({ org: orgId }),
  ],
  "org:admin": orgId => [
    ...orgRolePerms["org:viewer"](orgId),

    permissions.org.delete({ org: orgId }),
    permissions.org.edit({ org: orgId }),
    permissions.org.member.create({ org: orgId }),
    permissions.org.member.edit({ org: orgId, mbr: all }),
    permissions.org.member.delete({ org: orgId, mbr: all }),
    permissions.org.invite.create({ org: orgId }),
    permissions.org.invite.delete({ org: orgId, inv: all }),
    permissions.org.monitor.create({ org: orgId }),
    permissions.org.monitor.edit({ org: orgId, mtr: all }),
    permissions.org.monitor.delete({ org: orgId, mtr: all }),
    permissions.org.contactPoint.create({ org: orgId }),
    permissions.org.contactPoint.edit({ org: orgId, con: all }),
    permissions.org.contactPoint.delete({ org: orgId, con: all }),
    permissions.org.statusPage.create({ org: orgId }),
    permissions.org.statusPage.edit({ org: orgId, stspg: all }),
    permissions.org.statusPage.delete({ org: orgId, stspg: all }),
  ],
};
