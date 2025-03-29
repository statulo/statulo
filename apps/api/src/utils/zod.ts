import { z } from 'zod';

export function passwordSchema() {
  return z
    .string()
    .min(8)
    .max(256)
    .regex(/^[\S]*$/g, 'Password may not have whitespace')
    .regex(/\d/g, 'Password must have a number')
    .regex(/[^a-zA-Z\d]/g, 'Password must have a special character');
}
