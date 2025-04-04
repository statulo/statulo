import type { EnumType } from '@/utils/types';
import { z } from 'zod';

export const appRoles = {
  admin: 'app:admin', // system admin, can do everything
} as const;
export type AppRoles = EnumType<typeof appRoles>;
export const appRolesSchema = z.nativeEnum(appRoles);

export const orgRoles = {
  admin: 'org:admin', // organisation admin, can do everything on an org
  viewer: 'org:viewer', // viewer, can view everything in an org
} as const;
export type OrgRoles = EnumType<typeof orgRoles>;
export const orgRolesSchema = z.nativeEnum(orgRoles);
