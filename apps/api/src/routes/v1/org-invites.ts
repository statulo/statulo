import { z } from 'zod';
import { mapPage, pagerSchema } from '@/utils/pages';
import { makeRouter } from '@/utils/router';
import { handle } from '@/utils/handle';
import { permissions } from '@/utils/permissions/permissions';
import { prisma } from '@/modules/db';
import { NotFoundError } from '@/utils/error';
import { orgRolesSchema } from '@/utils/permissions/roles';
import { getId } from '@/utils/id';
import { generateSecureKey } from '@/utils/auth/password';
import { mapOrgInvite } from './mappings/org-invite';

export const orgInviteRouter = makeRouter((app) => {
  app.post(
    '/api/v1/organisations/:org/org-invites',
    {
      schema: {
        description: 'Create invitation',
        params: z.object({
          org: z.string(),
        }),
        body: z.object({
          email: z.string().email(),
          roles: z.array(orgRolesSchema),
        }),
      },
    },
    handle(async ({ params, body, auth }) => {
      auth.can(permissions.org.invite.create({ org: params.org }));

      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      const newInvite = await prisma.orgInvite.create({
        data: {
          email: body.email,
          code: generateSecureKey(),
          id: getId('orginv'),
          orgId: params.org,
          userId: user?.id,
          roles: body.roles,
        },
        include: {
          org: true,
          user: true,
        },
      });

      return mapOrgInvite(newInvite);
    }),
  );

  app.delete(
    '/api/v1/organisations/:org/org-invites/:id',
    {
      schema: {
        description: 'Delete invitation',
        params: z.object({
          org: z.string(),
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.can(permissions.org.invite.delete({ org: params.org, inv: params.id }));

      const oldInvites = await prisma.orgInvite.deleteMany({
        where: {
          orgId: params.org,
          id: params.id,
        },
      });
      if (oldInvites.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    '/api/v1/organisations/:org/org-invites',
    {
      schema: {
        description: 'List invites',
        params: z.object({
          org: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ params, auth, query }) => {
      auth.can(permissions.org.invite.list({ org: params.org }));

      const totalInvites = await prisma.orgInvite.count();
      const invites = await prisma.orgInvite.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.org,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          org: true,
          user: true,
        },
      });
      return mapPage(query, invites.map(mapOrgInvite), totalInvites);
    }),
  );
});
