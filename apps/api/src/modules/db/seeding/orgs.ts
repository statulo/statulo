import { orgRoles } from '@/utils/permissions/roles';
import { prisma } from '..';
import { testUser } from './users';

const legitCompany = {
  id: 'org_01jqvh74fvfahtq3q72ftertjj',
  memberId: 'orgmbr_01jqvh74fvfahtq3q9mexxp8zv',
};

export async function seedOrgs() {
  await prisma.organisation.create({
    data: {
      id: legitCompany.id,
      name: 'Totally Legit Company',
      description: 'We\'re legit, trust us!',
      members: {
        create: {
          id: legitCompany.memberId,
          roles: [orgRoles.admin],
          userId: testUser.id,
        },
      },
    },
  });
}
