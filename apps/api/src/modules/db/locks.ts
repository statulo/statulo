import { prisma } from '@/modules/db';
import { logger } from '@/modules/log';

export const lockIds = {
  cleanupPendingEmailVerifications: 10,
} as const;

type LockId = keyof typeof lockIds;

/**
 * Run a method using a PostgreSQL advisory lock ensuring only one instance of the function
 * runs across all instances of the app.
 */
export async function runOnceWithLock(
  lockId: LockId,
  fn: () => Promise<any>,
): Promise<any> {
  const lock = lockIds[lockId];

  // Acquire the lock
  const acquired = await tryAcquireLock(lock);
  if (!acquired) {
    logger.debug(`Lock '${lockId}' acquired by another instance, skipping...`);
    return;
  }

  try {
    return await fn();
  } finally {
    await releaseLock(lock);
  }
}

async function tryAcquireLock(lockId: number): Promise<boolean> {
  const result = await prisma.$queryRawUnsafe<{ pg_try_advisory_lock: boolean }[]>(
    `SELECT pg_try_advisory_lock(${lockId})`,
  );
  return result[0]?.pg_try_advisory_lock ?? false;
}

async function releaseLock(lockId: number) {
  await prisma.$executeRawUnsafe(`SELECT pg_advisory_unlock(${lockId})`);
}
