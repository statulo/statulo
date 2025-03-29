import type { EnumType } from '../types';

export const all = Symbol('any-resource');

export const permAction = {
  read: 'read',
  create: 'create',
  delete: 'delete',
  list: 'list',
} as const;
export type PermAction = EnumType<typeof permAction>;

export type PermissionDescription<TParams extends string = never> = {
  (params: Record<TParams, string | typeof all>): Permission;
  with<const TArgs extends string[]>(...args: TArgs): PermissionDescription<TArgs[number]>;
};

export type Permission = {
  action: PermAction;
  path: (string | typeof all)[];
};

export function makePermissionBuilder() {
  return {
    create(action: PermAction, path: string): PermissionDescription<string> {
      const desc = (_params: Record<string, string | typeof all>) => {
        if (!path.startsWith('/')) throw new Error('Permission path must start with slash');
        return {
          action,
          path: path.split('/').slice(1), // remove first empty segment
        };
      };
      desc.with = () => {
        return desc;
      };
      return desc;
    },
  };
}
