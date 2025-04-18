import type { ArrayValues } from "type-fest";
import { typeidUnboxed } from "typeid-js";
import * as nanoid from "nanoid";

export const idTypes = [
  "usr", // user
  "ses", // user session
  "org", // organisation
  "orgmbr", // organisation member
  "orginv", // org invite
  "mtr", // monitor
  "stspg", // status page
] as const;

export function getId(prefix: ArrayValues<typeof idTypes>): string {
  return typeidUnboxed(prefix);
}

// Some tables aren't used in endpoints, so they can get an untyped id
export function getUntypedId(): string {
  return typeidUnboxed();
}

// Alphabet is "nolookalikessafe" from "nanoid-dictionary": https://github.com/CyberAP/nanoid-dictionary#nolookalikessafe
const externalIdGenerator = nanoid.customAlphabet("6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz", 10);
export function getExternalId(): string {
  return externalIdGenerator();
}
