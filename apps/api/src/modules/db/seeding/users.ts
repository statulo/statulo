import { appRoles } from '@/utils/permissions/roles';
import { prisma } from '..';
import { hashPassword } from '@/utils/auth/password';
import { sessionExpiryInMs } from '@/utils/auth/session';

export const adminUser = {
  id: 'usr_01jqs4rrjve8mr5jmaqz7rzxnh',
  email: 'admin@statulo.com',
  sessionId: 'ses_01jqvmcf0ffq8sf628wa5se6bh',
  password: 'Testtest123!',
  roles: [appRoles.admin],
};

export const testUser = {
  id: 'usr_01jqs42erwf2697qc73vzwnkwt',
  email: 'test@statulo.com',
  sessionId: 'ses_01jqvmc6cafq8sf626crrhpwxa',
  password: 'Testtest123!',
  roles: [],
};

export async function seedUsers() {
  await prisma.user.createMany({
    data: [
      {
        id: adminUser.id,
        email: adminUser.email,
        passwordHash: await hashPassword(adminUser.password),
        roles: adminUser.roles,
      },
      {
        id: testUser.id,
        email: testUser.email,
        passwordHash: await hashPassword(testUser.password),
        roles: testUser.roles,
      },
    ],
  });
  await prisma.userSession.createMany({
    data: [{
      id: adminUser.sessionId,
      expiresAt: new Date(Date.now() + sessionExpiryInMs),
      userId: adminUser.id,
    }, {
      id: testUser.sessionId,
      expiresAt: new Date(Date.now() + sessionExpiryInMs),
      userId: testUser.id,
    }],
  });
}
