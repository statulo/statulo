import type { Permission } from './permission-builder';
import { all } from './permission-builder';

export function checkPermission(
  resourcePerm: Permission,
  userPerm: Permission,
): boolean {
  // difference in permission path length or action can never result to true
  if (resourcePerm.path.length !== userPerm.path.length) return false;
  if (resourcePerm.action !== userPerm.action) return false;

  if (resourcePerm.path.includes(all))
    throw new Error('Wildcards are not allowed in a permission that being checked');

  for (let i = 0; i < resourcePerm.path.length; i++) {
    const resourcePermPart = resourcePerm.path[i];
    const userPermPart = userPerm.path[i];

    // equal, this segment is valid
    if (resourcePermPart === userPermPart) continue;

    // user has wildcard for this segment, this segment is valid
    if (userPermPart === all) continue;

    // nothing less to check, invalid check
    return false;
  }

  return true;
}
