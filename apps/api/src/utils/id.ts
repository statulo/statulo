import type { ArrayValues } from 'type-fest';
import { typeidUnboxed } from 'typeid-js';

export const idTypes = [
  'usr', // user
  'ses', // user session
  'org', // organisation
  'orgmbr', // organisation member
  'orginv', // org invite
  'mtr', // monitor
] as const;

export function getId(prefix: ArrayValues<typeof idTypes>): string {
  return typeidUnboxed(prefix);
}

// Some tables aren't used in endpoints, so they can get an untyped id
export function getUntypedId(): string {
  return typeidUnboxed();
}
