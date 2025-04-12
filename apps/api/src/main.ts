import { createProgram } from '@/cli';
import { setupMailer } from '@/modules/emails';
import {
  setupFastify,
  setupFastifyRoutes,
  startFastify,
} from '@/modules/fastify';
import { logDivide, logger, logIntro } from '@/modules/log';
import { setupScheduler } from '@/modules/scheduled';

async function run() {
  const log = logger.child({ svc: 'statulo' });

  logIntro();
  log.info(`App booting...`);

  const app = await setupFastify();
  await setupFastifyRoutes(app);
  await setupMailer();
  setupScheduler();
  await startFastify(app);

  log.info(`App setup, ready to accept connections`);
  logDivide();
}

const program = createProgram(run);
await program.parseAsync(process.argv);
