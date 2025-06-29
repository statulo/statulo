import { seedUsers } from "./seeding/users";
import { seedOrgs } from "./seeding/orgs";
import { seedStatusPages } from "@/modules/db/seeding/statusPages";

export async function seed() {
  await seedUsers();
  await seedOrgs();
  await seedStatusPages();
}
