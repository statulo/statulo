import { makePermissionBuilder } from './permission-builder';

const p = makePermissionBuilder();

export const permissions = {
  user: {
    list: p.create('list', '/user'),
    create: p.create('create', '/user'),
    read: p.create('read', '/user/:usr').with('usr'),
    delete: p.create('delete', '/user/:usr').with('usr'),
  },
  org: {
    list: p.create('list', '/organisation'),
    create: p.create('create', '/organisation'),
    read: p.create('read', '/organisation/:org').with('org'),
    delete: p.create('delete', '/organisation/:org').with('org'),
    member: {
      list: p.create('list', '/organisation/:org/member').with('org'),
      create: p.create('create', '/organisation/:org/member').with('org'),
      read: p.create('read', '/organisation/:org/member/:mbr').with('org', 'mbr'),
      delete: p.create('delete', '/organisation/:org/member/:mbr').with('org', 'mbr'),
    },
  },
};
