import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/db";
import { legitCompany } from "@/modules/db/seeding/orgs";
import type { Interval } from "@/utils/monitors/intervals";

const interval: Interval = {
  unit: "m",
  amount: 5,
};

const exampleMonitor: Prisma.MonitorCreateInput = {
  id: "mtr_01jyxtq983fq9rdtp5jnc207v8",
  name: "Example Monitor",
  type: "http",
  org: {
    connect: {
      id: legitCompany.id,
    },
  },
  createdAt: new Date(),
  http: {
    create: {
      url: "https://example.com",
      id: "01jyxtq983fq9rdtpex07ah1y5",
      interval,
      allowedStatusCodes: ["200-299"],
    },
  },
};

const exampleStatusPage: Prisma.StatusPageCreateInput = {
  id: "stspg_01jyxtq9ryfq9rdtph32s0qrhe",
  name: "Example Status Page",
  externalId: "kLbTRM67Bp",
  org: {
    connect: {
      id: legitCompany.id,
    },
  },
  createdAt: new Date(),
  statusPageMonitors: {
    create: {
      id: "stspg_mtr_01jyxtq9ryfq9rdtpy4tm1mwym",
      monitorId: exampleMonitor.id,
    },
  },
};

export async function seedStatusPages() {
  await prisma.monitor.create({
    data: exampleMonitor,
  });

  await prisma.statusPage.create({
    data: exampleStatusPage,
  });
}
