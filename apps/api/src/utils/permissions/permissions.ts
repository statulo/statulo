import { makePermissionBuilder } from './permission-builder';

const p = makePermissionBuilder();

export const permissions = {
  user: {
    list: p.create('list', '/user'),
    create: p.create('create', '/user'),
    read: p.create('read', '/user/:usr'),
    delete: p.create('delete', '/user/:usr'),
  },
  org: {
    list: p.create('list', '/organisation'),
    create: p.create('create', '/organisation'),
    read: p.create('read', '/organisation/:org'),
    delete: p.create('delete', '/organisation/:org'),
    member: {
      list: p.create('list', '/organisation/:org/member'),
      create: p.create('create', '/organisation/:org/member'),
      read: p.create('read', '/organisation/:org/member/:mbr'),
      delete: p.create('delete', '/organisation/:org/member/:mbr'),
    },
  },
};
