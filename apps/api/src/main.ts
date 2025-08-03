import { createProgram } from "@/cli";
import { isPrismaConnected } from "@/modules/db";
import { setupMailer } from "@/modules/emails";
import {
  setupFastify,
  setupFastifyRoutes,
  startFastify,
} from "@/modules/fastify";
import { logDivide, logger, logIntro } from "@/modules/log";
import { setupScheduler } from "@/modules/scheduled";

async function run() {
  const log = logger.child({ svc: "statulo" });

  logIntro();
  log.info(`App booting...`);

  const dbConnected = await isPrismaConnected();
  if (!dbConnected) {
    log.error(`Database connection failed. Please check your configuration.`);
    process.exit(1);
  }
  log.info(`Database connection established successfully.`);

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
