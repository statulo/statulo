import { prisma } from "@/modules/db";
import { logger } from "@/modules/log";
import type { PrismaClient } from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/client";

export const lockIds = {
  cleanupPendingEmailVerifications: 10,
} as const;

type LockId = keyof typeof lockIds;

// This is the client type that is passed to the transaction callback
type TransactionPrismaClient = Omit<PrismaClient, ITXClientDenyList>;

/**
 * Run a method using a PostgreSQL advisory lock ensuring only one instance of the function
 * runs across all instances of the app.
 */
export async function runOnceWithLock<T>(
  lockId: LockId,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  const lock = lockIds[lockId];

  return await prisma.$transaction(async (client) => {
    const acquired = await tryAcquireLock(client, lock);
    if (!acquired) {
      logger.debug(`Lock '${lockId}' acquired by another instance, skipping...`);
      return;
    }

    try {
      return await fn();
    } finally {
      await releaseLock(client, lock);
    }
  });
}

async function tryAcquireLock(client: TransactionPrismaClient, lockId: number): Promise<boolean> {
  const result = await client.$queryRawUnsafe<{ pg_try_advisory_lock: boolean }[]>(
    `SELECT pg_try_advisory_lock(${lockId})`,
  );
  return result[0]?.pg_try_advisory_lock ?? false;
}

async function releaseLock(client: TransactionPrismaClient, lockId: number) {
  await client.$executeRawUnsafe(`SELECT pg_advisory_unlock(${lockId})`);
}
