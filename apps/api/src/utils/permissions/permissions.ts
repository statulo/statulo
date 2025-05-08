import { makePermissionBuilder } from "@/utils/permissions/permission-builder";

const p = makePermissionBuilder();

export const permissions = {
  user: {
    list: p.create("list", "/user"),
    create: p.create("create", "/user"),
    read: p.create("read", "/user/:usr"),
    delete: p.create("delete", "/user/:usr"),
    edit: p.create("edit", "/user/:usr"),
    orgInvites: {
      list: p.create("list", "/user/:usr/org-invite"),
    },
  },
  org: {
    list: p.create("list", "/organisation"),
    create: p.create("create", "/organisation"),
    read: p.create("read", "/organisation/:org"),
    delete: p.create("delete", "/organisation/:org"),
    edit: p.create("edit", "/organisation/:org"),
    member: {
      list: p.create("list", "/organisation/:org/member"),
      create: p.create("create", "/organisation/:org/member"),
      read: p.create("read", "/organisation/:org/member/:mbr"),
      delete: p.create("delete", "/organisation/:org/member/:mbr"),
      edit: p.create("edit", "/organisation/:org/member/:mbr"),
    },
    invite: {
      list: p.create("list", "/organisation/:org/invite"),
      create: p.create("create", "/organisation/:org/invite"),
      delete: p.create("delete", "/organisation/:org/invite/:inv"),
    },
    monitor: {
      list: p.create("list", "/organisation/:org/monitor"),
      create: p.create("create", "/organisation/:org/monitor"),
      read: p.create("read", "/organisation/:org/monitor/:mtr"),
      delete: p.create("delete", "/organisation/:org/monitor/:mtr"),
      edit: p.create("edit", "/organisation/:org/monitor/:mtr"),
    },
    statusPage: {
      list: p.create("list", "/organisation/:org/statusPage"),
      create: p.create("create", "/organisation/:org/statusPage"),
      read: p.create("read", "/organisation/:org/statusPage/:stspg"),
      delete: p.create("delete", "/organisation/:org/statusPage/:stspg"),
      edit: p.create("edit", "/organisation/:org/statusPage/:stspg"),
    },
    contactPoint: {
      list: p.create("list", "/organisation/:org/contact-point"),
      create: p.create("create", "/organisation/:org/contact-point"),
      read: p.create("read", "/organisation/:org/contact-point/:con"),
      delete: p.create("delete", "/organisation/:org/contact-point/:con"),
      edit: p.create("edit", "/organisation/:org/contact-point/:con"),
    },
  },
};
