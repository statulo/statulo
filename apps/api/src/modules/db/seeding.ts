import { seedUsers } from "./seeding/users";
import { seedOrgs } from "./seeding/orgs";
import { seedAgents } from "@/modules/db/seeding/agents";

export async function seed() {
  await seedUsers();
  await seedOrgs();
  await seedAgents();
}
