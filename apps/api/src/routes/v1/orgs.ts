import { prisma } from '@/modules/db';
import { handle } from '@/utils/handle';
import { getId } from '@/utils/id';
import { permissions } from '@/utils/permissions/permissions';
import { orgRoles } from '@/utils/permissions/roles';
import { makeRouter } from '@/utils/router';
import { z } from 'zod';
import { mapOrganisation } from './mappings/organisation';
import { NotFoundError } from '@/utils/error';
import { mapPage, pagerSchema } from '@/utils/pages';

export const orgRouter = makeRouter((app) => {
  app.post(
    '/api/v1/organisations',
    {
      schema: {
        description: 'Create organisation',
        body: z.object({
          name: z.string().min(1),
          description: z.string().min(1).nullable(),
        }),
      },
    },
    handle(async ({ body, auth }) => {
      auth.can(permissions.org.create({}));
      const newOrg = await prisma.organisation.create({
        data: {
          id: getId('org'),
          name: body.name,
          description: body.description,
          members: {
            create: {
              id: getId('orgmbr'),
              roles: [orgRoles.admin],
              userId: auth.data.getUserId(),
            },
          },
        },
      });
      return mapOrganisation(newOrg);
    }),
  );

  app.delete(
    '/api/v1/organisations/:id',
    {
      schema: {
        description: 'Delete organisation',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.can(permissions.org.delete({ org: params.id }));

      const oldOrgs = await prisma.organisation.deleteMany({
        where: {
          id: params.id,
        },
      });
      if (oldOrgs.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    '/api/v1/organisations/:id',
    {
      schema: {
        description: 'Get organisation',
        params: z.object({
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.can(permissions.org.read({ org: params.id }));
      const org = await prisma.organisation.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!org) throw new NotFoundError();
      return mapOrganisation(org);
    }),
  );

  app.get(
    '/api/v1/organisations',
    {
      schema: {
        description: 'List organisations',
        querystring: pagerSchema(),
      },
    },
    handle(async ({ query, auth }) => {
      auth.can(permissions.org.list({}));

      const totalOrgs = await prisma.organisation.count();
      const orgs = await prisma.organisation.findMany({
        take: query.limit,
        skip: query.offset,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return mapPage(query, orgs.map(mapOrganisation), totalOrgs);
    }),
  );
});
