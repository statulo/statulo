import { z } from "zod";
import { mapPage, pagerSchema } from "@/utils/pages";
import { makeRouter } from "@/utils/router";
import { handle } from "@/utils/handle";
import { prisma } from "@/modules/db";
import { NotFoundError } from "@/utils/error";
import { permissions } from "@/utils/permissions/permissions";
import { mapStatusPageMonitor } from "@/routes/v1/mappings/status-page";
import { mapSuccess } from "@/routes/v0/mappings/success";
import { getId } from "@/utils/id";

export const statusPageMonitorRouter = makeRouter((app) => {
  app.get("/api/v1/status-pages/:id/monitors", {
    schema: {
      description: "Get all monitors for a status page",
      params: z.object({
        id: z.string(),
      }),
      querystring: pagerSchema(),
    },
  }, handle(async ({ auth, params, query }) => {
    auth.checkAuthentication();
    const statusPage = await prisma.statusPage.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!statusPage) throw new NotFoundError();

    auth.can(permissions.org.statusPage.read({ org: statusPage.orgId, stspg: statusPage.id }));

    const monitors = await prisma.statusPageMonitor.findMany({
      where: {
        statusPageId: statusPage.id,
      },
      include: {
        monitor: {
          include: {
            http: true,
          },
        },
      },
      take: query.limit,
      skip: query.offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    return mapPage(query, monitors.map(mapStatusPageMonitor), monitors.length);
  }));

  app.get("/api/v1/status-pages/:id/monitors/:monitorId", {
    schema: {
      description: "Get a monitor for a status page",
      params: z.object({
        id: z.string(),
        monitorId: z.string(),
      }),
    },
  }, handle(async ({ auth, params }) => {
    auth.checkAuthentication();
    const statusPage = await prisma.statusPage.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!statusPage) throw new NotFoundError();
    auth.can(permissions.org.statusPage.read({ org: statusPage.orgId, stspg: statusPage.id }));

    const monitor = await prisma.statusPageMonitor.findUnique({
      where: {
        id: params.monitorId,
        statusPageId: statusPage.id,
      },
      include: {
        monitor: {
          include: {
            http: true,
          },
        },
      },
    });

    if (!monitor) throw new NotFoundError();
    return mapStatusPageMonitor(monitor);
  }));

  app.post("/api/v1/status-pages/:id/monitors/:monitorId", {
    schema: {
      description: "Add a monitor to a status page",
      params: z.object({
        id: z.string(),
        monitorId: z.string(),
      }),
    },
  }, handle(async ({ auth, params }) => {
    auth.checkAuthentication();
    const statusPage = await prisma.statusPage.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!statusPage) throw new NotFoundError();
    auth.can(permissions.org.statusPage.edit({ org: statusPage.orgId, stspg: statusPage.id }));

    const monitor = await prisma.monitor.findUnique({
      where: {
        id: params.monitorId,
      },
      include: {
        http: true,
      },
    });

    if (!monitor) throw new NotFoundError();

    const statusPageMonitor = await prisma.statusPageMonitor.create({
      data: {
        id: getId("stspg_mtr"),
        statusPageId: statusPage.id,
        monitorId: monitor.id,
      },
    });

    return mapStatusPageMonitor({ ...statusPageMonitor, monitor });
  }));

  app.delete("/api/v1/status-pages/:id/monitors/:monitorId", {
    schema: {
      description: "Delete a monitor for a status page",
      params: z.object({
        id: z.string(),
        monitorId: z.string(),
      }),
    },
  }, handle(async ({ auth, params }) => {
    auth.checkAuthentication();
    const statusPage = await prisma.statusPage.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!statusPage) throw new NotFoundError();
    auth.can(permissions.org.statusPage.edit({ org: statusPage.orgId, stspg: statusPage.id }));

    const monitor = await prisma.statusPageMonitor.findUnique({
      where: {
        id: params.monitorId,
        statusPageId: statusPage.id,
      },
    });

    if (!monitor) throw new NotFoundError();

    await prisma.statusPageMonitor.delete({
      where: {
        id: monitor.id,
      },
    });

    return mapSuccess();
  }));
});
