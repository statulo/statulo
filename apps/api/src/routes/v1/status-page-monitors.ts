import { z } from "zod";
import { mapPage, pagerSchema } from "@/utils/pages";
import { makeRouter } from "@/utils/router";
import { handle } from "@/utils/handle";
import { prisma } from "@/modules/db";
import { NotFoundError } from "@/utils/error";
import { permissions } from "@/utils/permissions/permissions";
import { mapStatusPageMonitor } from "@/routes/v1/mappings/status-page";

// POST /api/v1/status-pages/:id/monitors/:monitorId
// PATCH /api/v1/status-pages/:id/monitors/:monitorId
// GET /api/v1/status-pages/:id/monitors/:monitorId
// GET /api/v1/status-pages/:id/monitors
// DELETE /api/v1/status-pages/:id/monitors/:monitorId

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
  }),
  );
});
