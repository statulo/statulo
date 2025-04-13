import { logger } from '@/modules/log';
import { executeCleanupPendingEmailVerifications } from '@/modules/scheduled/cleanup';
import { executeHttpMonitors } from '@/modules/scheduled/monitors';
import cron from 'node-cron';

const log = logger.child({ svc: 'scheduler' });

function registerSchedule(schedule: string, name: string, fn: () => void | Promise<void>) {
  cron.schedule(schedule, async () => {
    try {
      const result = fn();
      await result;
    } catch (err) {
      log.error(`Error in schedule ${name}`, err);
    }
  });
  log.info(`Added schedule ${name} for ${schedule}`);
}

export async function setupScheduler(): Promise<void> {
  log.info(`setting up scheduler...`);
  registerSchedule('* * * * *', 'execute-http-monitors', executeHttpMonitors);
  registerSchedule('0 2 * * *', 'cleanup-pending-email-verifications', executeCleanupPendingEmailVerifications);
  log.info(`setting up scheduler...`);
}
