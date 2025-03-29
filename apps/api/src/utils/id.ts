import type { ArrayValues } from 'type-fest';
import { typeidUnboxed } from 'typeid-js';

const _types = [
  'usr', // user
  'ses', // user session
  'org', // organisation
  'orgmbr', // organisation member
] as const;

export function getId(prefix: ArrayValues<typeof _types>): string {
  return typeidUnboxed(prefix);
}
