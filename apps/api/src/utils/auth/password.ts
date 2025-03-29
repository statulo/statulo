import { randomBytes } from 'node:crypto';
import { hash, verify } from 'argon2';

export async function hashPassword(pass: string): Promise<string> {
  return hash(pass);
}

export async function verifyPassword(
  passwordHash: string,
  pass: string,
): Promise<boolean> {
  return verify(passwordHash, pass);
}

export function generateSecureKey(): string {
  return randomBytes(32).toString('hex');
}
