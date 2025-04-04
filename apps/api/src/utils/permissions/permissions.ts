import { makePermissionBuilder } from '@/utils/permissions/permission-builder';

const p = makePermissionBuilder();

export const permissions = {
  user: {
    list: p.create('list', '/user'),
    create: p.create('create', '/user'),
    read: p.create('read', '/user/:usr'),
    delete: p.create('delete', '/user/:usr'),
    edit: p.create('edit', '/user/:usr'),
  },
  org: {
    list: p.create('list', '/organisation'),
    create: p.create('create', '/organisation'),
    read: p.create('read', '/organisation/:org'),
    delete: p.create('delete', '/organisation/:org'),
    edit: p.create('edit', '/organisation/:org'),
    member: {
      list: p.create('list', '/organisation/:org/member'),
      create: p.create('create', '/organisation/:org/member'),
      read: p.create('read', '/organisation/:org/member/:mbr'),
      delete: p.create('delete', '/organisation/:org/member/:mbr'),
      edit: p.create('edit', '/organisation/:org/member/:mbr'),
    },
    invite: {
      list: p.create('list', '/organisation/:org/invite'),
      create: p.create('create', '/organisation/:org/invite'),
      delete: p.create('delete', '/organisation/:org/invite/:inv'),
    },
  },
};
