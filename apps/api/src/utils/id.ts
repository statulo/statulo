import type { ArrayValues } from 'type-fest';
import { typeidUnboxed } from 'typeid-js';

const _types = [
  'usr', // user
  'ses', // user session
  'org', // organisation
  'orgmbr', // organisation member
  'orginv', // org invite
  'mtr', // monitor
  'con', // contact point
] as const;

export function getId(prefix: ArrayValues<typeof _types>): string {
  return typeidUnboxed(prefix);
}

// Some tables aren't used in endpoints, so they can get an untyped id
export function getUntypedId(): string {
  return typeidUnboxed();
}
