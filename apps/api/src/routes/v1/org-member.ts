import { z } from 'zod';
import { mapPage, pagerSchema } from '@/utils/pages';
import { makeRouter } from '@/utils/router';
import { handle } from '@/utils/handle';
import { permissions } from '@/utils/permissions/permissions';
import { prisma } from '@/modules/db';
import { ApiError, NotFoundError } from '@/utils/error';
import { mapOrgMember } from './mappings/org-member';
import { orgRoles, orgRolesSchema } from '@/utils/permissions/roles';

export const orgMemberRouter = makeRouter((app) => {
  app.delete(
    '/api/v1/organisations/:org/members/:id',
    {
      schema: {
        description: 'Delete organisation member',
        params: z.object({
          org: z.string(),
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.can(permissions.org.member.delete({ org: params.org, mbr: params.id }));

      const adminOrgMembers = await prisma.orgMember.findMany({
        where: {
          orgId: params.org,
          roles: {
            has: orgRoles.admin,
          },
        },
        select: {
          id: true,
        },
      });
      const adminOrgMemberIds = adminOrgMembers.map(v => v.id);
      if (adminOrgMemberIds.length <= 1 && adminOrgMemberIds.includes(params.id))
        throw ApiError.forCode('removeLastAdmin', 400);

      const oldMembers = await prisma.orgMember.deleteMany({
        where: {
          orgId: params.org,
          id: params.id,
        },
      });
      if (oldMembers.count === 0) throw new NotFoundError();
      return {
        id: params.id,
      };
    }),
  );

  app.get(
    '/api/v1/organisations/:org/members/:id',
    {
      schema: {
        description: 'Get organisation member',
        params: z.object({
          org: z.string(),
          id: z.string(),
        }),
      },
    },
    handle(async ({ params, auth }) => {
      auth.can(permissions.org.member.read({ org: params.org, mbr: params.id }));
      const member = await prisma.orgMember.findUnique({
        where: {
          orgId: params.org,
          id: params.id,
        },
        include: {
          user: true,
        },
      });
      if (!member) throw new NotFoundError();
      return mapOrgMember(member);
    }),
  );

  app.patch(
    '/api/v1/organisations/:org/members/:id',
    {
      schema: {
        description: 'Update organisation member',
        params: z.object({
          org: z.string(),
          id: z.string(),
        }),
        body: z.object({
          roles: z.array(orgRolesSchema).optional(),
        }),
      },
    },
    handle(async ({ params, body, auth }) => {
      auth.can(permissions.org.member.edit({ org: params.org, mbr: params.id }));

      const oldMember = await prisma.orgMember.findFirst({
        where: {
          orgId: params.org,
          id: params.id,
        },
        include: {
          user: true,
        },
      });
      if (!oldMember) throw new NotFoundError();

      const isRemovingAdmin = body.roles && oldMember.roles.includes(orgRoles.admin) && !body.roles.includes(orgRoles.admin);
      if (isRemovingAdmin) {
        const adminOrgMembers = await prisma.orgMember.findMany({
          where: {
            orgId: params.org,
            roles: {
              has: orgRoles.admin,
            },
          },
          select: {
            id: true,
          },
        });
        const adminOrgMemberIds = adminOrgMembers.map(v => v.id);
        if (adminOrgMemberIds.length <= 1 && adminOrgMemberIds.includes(params.id))
          throw ApiError.forCode('removeLastAdmin', 400);
      }

      const member = await prisma.orgMember.update({
        where: {
          orgId: params.org,
          id: params.id,
        },
        data: {
          roles: body.roles,
        },
        include: {
          user: true,
        },
      });
      if (!member) throw new NotFoundError();
      return mapOrgMember(member);
    }),
  );

  app.get(
    '/api/v1/organisations/:org/members',
    {
      schema: {
        description: 'List organisation members',
        params: z.object({
          org: z.string(),
        }),
        querystring: pagerSchema(),
      },
    },
    handle(async ({ params, auth, query }) => {
      auth.can(permissions.org.member.list({ org: params.org }));

      const totalMembers = await prisma.orgMember.count();
      const members = await prisma.orgMember.findMany({
        take: query.limit,
        skip: query.offset,
        where: {
          orgId: params.org,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      });
      return mapPage(query, members.map(mapOrgMember), totalMembers);
    }),
  );
});
