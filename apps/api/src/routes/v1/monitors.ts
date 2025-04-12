import { prisma } from '@/modules/db';
import { handle } from '@/utils/handle';
import { getId, getUntypedId } from '@/utils/id';
import { permissions } from '@/utils/permissions/permissions';
import { makeRouter } from '@/utils/router';
import { z } from 'zod';
import { ApiError, NotFoundError } from '@/utils/error';
import { mapPage, pagerSchema } from '@/utils/pages';
import type { Prisma } from '@prisma/client';
import type { EnumType } from '@/utils/types';
import { rangeSchema, rangeToString } from '@/utils/monitors/ranges';
import { mapMonitor, mapShallowMonitor } from '@/routes/v1/mappings/monitor';

export const monitorTypes = {
  http: 'http',
} as const;
export type MonitorTypes = EnumType<typeof monitorTypes>;

export const monitorRouter = makeRouter((app) => {
  app.post(
    '/api/v1/organisations/:id/monitors',
    {
      schema: {
        description: 'Create monitor',
        params: z.object({
          id: z.string(),
        }),
        body: z.discriminatedUnion('type', [
          z.object({
            type: z.literal(monitorTypes.http),
            data: z.object({
              url: z.string().url(),
              allowedStatusCodes: z.array(rangeSchema()).min(1),
              expectedKeywords: z.array(z.string().min(1)),
            }),
          }),
        ]).and(z.object({
          name: z.string().min(1).nullable(),
        })),
      },
    },
    handle(async ({ body, auth, params }) => {
      auth.can(permissions.org.monitor.create({ org: params.id }));

      const createPayload: Prisma.MonitorUncheckedCreateInput = {
        orgId: params.id,
        id: getId('mtr'),
        name: body.name,
        type: body.type,
      };

      if (body.type === monitorTypes.http) {
        createPayload.http = {
          create: {
            id: getUntypedId(),
            url: body.data.url,
            allowedStatusCodes: body.data.allowedStatusCodes.map(v => rangeToString(v)),
            expectedKeywords: body.data.expectedKeywords,
          },
        };
      }

      const newMonitor = await prisma.monitor.create({
        data: createPayload,
        include: {
          http: true,
        },
      });
      return mapMonitor(newMonitor);
    }),
  );

  app.patch(
    '/api/v1/monitors/:id',
    {
      schema: {
        description: 'Edit monitor',
        params: z.object({
          id: z.string(),
        }),
        body: z.discriminatedUnion('type', [
          z.object({
            type: z.literal(monitorTypes.http),
            data: z.object({
              url: z.string().url().optional(),
              allowedStatusCodes: z.array(rangeSchema()).min(1).optional(),
              expectedKeywords: z.array(z.string().min(1)).optional(),
            }),
          }),
        ]).and(z.object({
          name: z.string().min(1).nullable().optional(),
        })),
      },
    },
    handle(async ({ body, auth, params }) => {
      const monitor = await prisma.monitor.findUnique({
        where: {
          id: params.id,
        },
        include: {
          http: true,
        },
      });
      if (!monitor) throw new NotFoundError();
      auth.can(permissions.org.monitor.edit({ org: monitor.orgId, mtr: monitor.id }));

      if (monitor.type !== body.type)
        throw ApiError.forCode('cantChangeType', 400);

      const updatePayload: Prisma.MonitorUncheckedUpdateInput = {
        name: body.name,
      };

      if (monitor.type === monitorTypes.http) {
        const newStatusCodeRange = body.data.allowedStatusCodes !== undefined
          ? body.data.allowedStatusCodes.map(v => rangeToString(v))
          : undefined;
        updatePayload.http = {
          update: {
            url: body.data.url,
            expectedKeywords: body.data.expectedKeywords,
            allowedStatusCodes: newStatusCodeRange,
          },
        };
      }

      const newMonitor = await prisma.monitor.update({
        where: {
          id: monitor.id,
        },
        data: updatePayload,
        include: {
          http: true,
        },
      });
      return mapMonitor(newMonitor);
    }),
  );

  app.delete(
    '/api/v1/monitors/:id',
    {
      schema: {
        description: 'Delete monitor',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      const monitor = await prisma.monitor.findUnique({
        where: {
          id: params.id,
        },
        include: {
          http: true,
        },
      });
      if (!monitor) throw new NotFoundError();
      auth.can(permissions.org.monitor.delete({ org: monitor.orgId, mtr: monitor.id }));

      const oldMonitors = await prisma.monitor.deleteMany({
        where: {
          id: params.id,
        },
      });
      if (oldMonitors.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    '/api/v1/monitors/:id',
    {
      schema: {
        description: 'Get monitor',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      const monitor = await prisma.monitor.findUnique({
        where: {
          id: params.id,
        },
        include: {
          http: true,
        },
      });
      if (!monitor) throw new NotFoundError();
      auth.can(permissions.org.monitor.read({ org: monitor.orgId, mtr: monitor.id }));
      return mapMonitor(monitor);
    }),
  );

  app.get(
    '/api/v1/organisations/:id/monitors',
    {
      schema: {
        description: 'List monitors',
        params: z.object({
          id: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, params, auth }) => {
      auth.can(permissions.org.monitor.list({ org: params.id }));

      const totalMonitors = await prisma.monitor.count({
        where: {
          orgId: params.id,
        },
      });
      const monitors = await prisma.monitor.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          http: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });
      return mapPage(query, monitors.map(mapShallowMonitor), totalMonitors);
    }),
  );
});
