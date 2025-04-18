import { prisma } from "@/modules/db";
import { runOnceWithLock } from "@/modules/db/locks";
import { logger } from "@/modules/log";

const log = logger.child({ svc: "cleanup" });

export async function executeCleanupPendingEmailVerifications() {
  await runOnceWithLock("cleanupPendingEmailVerifications", async () => {
    const now = new Date();

    const deleteResult = await prisma.pendingEmailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    log.debug(`Cleaned up ${deleteResult.count} expired pending email verifications`);
  });
}
