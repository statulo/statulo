import { prisma } from '@/modules/db';
import { runOnceWithLock } from '@/modules/db/locks';
import { logger } from '@/modules/log';

const log = logger.child({ svc: 'cleanup' });

export async function executeCleanupPendingEmailVerifications() {
  await runOnceWithLock('cleanupPendingEmailVerifications', async () => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

    const deleteResult = await prisma.pendingEmailVerification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    log.debug(`Cleaned up ${deleteResult.count} email verifications older than ${cutoffDate.toISOString()}`);
  });
}
