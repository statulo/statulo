export type EnumType<E extends Record<string, string>> = E[keyof E];

export const tokenTypes = {
  session: "session",
} as const;
export type TokenTypes = EnumType<typeof tokenTypes>;

export const appRoles = {
  admin: "app:admin", // system admin, can do everything
} as const;
export type AppRoles = EnumType<typeof appRoles>;

export const orgRoles = {
  admin: "org:admin", // organisation admin, can do everything on an org
  viewer: "org:viewer", // viewer, can view everything in an org
} as const;
export type OrgRoles = EnumType<typeof orgRoles>;
