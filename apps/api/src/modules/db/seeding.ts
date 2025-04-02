import { seedUsers } from './seeding/users';
import { seedOrgs } from './seeding/orgs';

export async function seed() {
  await seedUsers();
  await seedOrgs();
}
