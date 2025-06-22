import type { ZodString } from "zod";

export function zNullString<T extends ZodString>(base: T) {
  return base.transform(val => (typeof val === "string" && val.trim() === "" ? null : val));
}
