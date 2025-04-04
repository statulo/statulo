import {
  setupFastify,
  setupFastifyRoutes,
  startFastify,
} from '@/modules/fastify';

async function run() {
  const log = logger.child({ svc: 'statulo' });

  logIntro();
  log.info(`App booting...`);

  const app = await setupFastify();
  await setupFastifyRoutes(app);
  await setupMailer();
  await startFastify(app);

  log.info(`App setup, ready to accept connections`);
  logDivide();
}

const program = createProgram(run);
await program.parseAsync(process.argv);
