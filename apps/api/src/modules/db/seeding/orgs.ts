import { prisma } from "..";
import { testUser } from "./users";
import { orgRoles } from "@/utils/permissions/roles";

export const legitCompany = {
  id: "org_01jqvh74fvfahtq3q72ftertjj",
  memberId: "orgmbr_01jqvh74fvfahtq3q9mexxp8zv",
};

const foobar = {
  id: "org_01jwpqqpmben8vqe1p7mfk6wxr",
  memberId: "orgmbr_01jwpndndnen8vqe11p3pk4t06",
};

export async function seedOrgs() {
  await prisma.organisation.create({
    data: {
      id: legitCompany.id,
      name: "Totally Legit Company",
      description: "We're legit, trust us!",
      members: {
        create: {
          id: legitCompany.memberId,
          roles: [orgRoles.admin],
          userId: testUser.id,
        },
      },
    },
  });

  await prisma.organisation.create({
    data: {
      id: foobar.id,
      name: "Foobar Industries",
      description: "Putting the foo in the bar!",
      members: {
        create: {
          id: foobar.memberId,
          roles: [orgRoles.admin],
          userId: testUser.id,
        },
      },
    },
  });
}
