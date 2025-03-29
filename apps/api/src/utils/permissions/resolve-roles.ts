import type { Organisation, OrgMember, User } from '@prisma/client';

type PopulatedOrgMember = OrgMember & { org: Organisation };
export type PopulatedUser = User & {
  orgMembers: PopulatedOrgMember[];
};
