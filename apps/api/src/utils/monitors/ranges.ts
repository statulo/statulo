import { z } from "zod";

export const rangeSchema = () => z.object({
  from: z.number().nonnegative(),
  to: z.number().nonnegative(),
});
export type Range = z.infer<ReturnType<typeof rangeSchema>>;

export function rangeToString(rangeObj: Range) {
  const to = Math.max(rangeObj.from, rangeObj.to);
  return `${rangeObj.from}-${to}`;
}

export function stringRangeToObject(range: string): Range {
  const isValid = /^\d+-\d+$/g.test(range);
  if (!isValid) throw new Error(`Cannot turn string range '${range}' to object`);

  const [from, to] = range.split("-").map(v => Number(v));
  const clampedTo = Math.max(from, to);
  return {
    from,
    to: clampedTo,
  };
}
