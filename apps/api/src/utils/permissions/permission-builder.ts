import type { EnumType, ExtractParams } from '@/utils/types';

export const all = Symbol('any-resource');

export const permAction = {
  read: 'read',
  create: 'create',
  delete: 'delete',
  list: 'list',
  edit: 'edit',
} as const;
export type PermAction = EnumType<typeof permAction>;

export type PermissionDescription<TParams extends string> = (params: Record<TParams, string | typeof all>) => Permission;

export type Permission = {
  action: PermAction;
  path: (string | typeof all)[];
};

export function makePermissionBuilder() {
  return {
    create<T extends string>(action: PermAction, path: T): PermissionDescription<ExtractParams<T>> {
      return (params: Record<string, string | typeof all>) => {
        if (!path.startsWith('/')) throw new Error('Permission path must start with slash');
        let parts: (string | typeof all)[] = path.split('/').slice(1); // remove first empty segment

        // add params into path parts
        parts = parts.map((v) => {
          if (typeof v !== 'string') return v;
          if (!v.startsWith(':')) return v;
          const paramName = v.slice(1);
          const paramValue = params[paramName];
          if (!paramValue) throw new Error('Invalid parameter in permission');
          return paramValue;
        });

        return {
          action,
          path: parts,
        };
      };
    },
  };
}
