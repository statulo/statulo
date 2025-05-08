import { z } from "zod";
import type { EnumType } from "@/utils/types";

export const intervalUnits = {
  seconds: "s",
  minutes: "m",
  hours: "h",
  days: "d",
} as const;
export type IntervalUnit = EnumType<typeof intervalUnits>;

const intervalMsMap: Record<IntervalUnit, number> = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
};

export const intervalSchema = () => z.object({
  unit: z.nativeEnum(intervalUnits),
  amount: z.number().positive().safe().finite().int(),
}).refine(validateInterval, {
  message: "Interval outside of acceptable range",
});
export type Interval = z.infer<ReturnType<typeof intervalSchema>>;

export function validateInterval({ unit, amount }: { unit: IntervalUnit; amount: number }): boolean {
  if (unit === intervalUnits.seconds) {
    if (amount >= 60) return false; // use minutes instead
    if (amount < 15) return false; // 15 seconds is the minimum
    return true;
  }
  if (unit === intervalUnits.minutes) {
    if (amount >= 60) return false; // use hours instead
    return true;
  }
  if (unit === intervalUnits.hours) {
    if (amount >= 24) return false; // use days instead
    return true;
  }
  if (unit === intervalUnits.days) {
    if (amount >= 90) return false; // 3 months is the maximum interval
    return true;
  }
  return false;
}

export function intervalToMs(interval: Interval): number {
  return intervalMsMap[interval.unit] * interval.amount;
}
