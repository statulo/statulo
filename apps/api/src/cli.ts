import { Command, program } from 'commander';
import { conf, version } from './config';
import { logDivide, logger, logIntro } from './modules/log';
import execSh from 'exec-sh';
import { cancel, confirm, isCancel, log, spinner, text } from '@clack/prompts';
import { prisma } from './modules/db';
import { appRoles } from './utils/permissions/roles';

async function migrate() {
  try {
    await execSh.promise('node node_modules/prisma/build/index.js migrate deploy', {
      env: {
        ...process.env,
        STL_DB__CONNECTION: conf.db.connection,
      },
    });
  } catch (err: any) {
    console.error(err.message);
  }
  console.log('');
}

const initCmd = new Command('init')
  .description('Initialize Statulo')
  .action(async () => {
    logIntro(true);
    logger.info('Initialising database...');
    await migrate();
    logDivide();
    logger.info('Initialisation complete!');
  });

const promoteCmd = new Command('promote')
  .description('Promote a user to Admin')
  .action(async () => {
    logIntro(true);
    const email = await text({
      message: 'What user do you want to promote to Admin?',
      placeholder: 'john@example.com',
    });
    if (isCancel(email)) {
      cancel('Operation cancelled.');
      process.exit(1);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      log.error('Could not find user with that username!');
      process.exit(1);
    }

    const shouldContinue = await confirm({
      message: `You are about to promote '${email}' to Super. Want to proceed?`,
      initialValue: false,
    });
    if (isCancel(shouldContinue)) {
      cancel('Operation cancelled.');
      process.exit(1);
    }

    const s = spinner();
    s.start('Promoting user');
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        roles: [...(user.roles ?? []), appRoles.admin],
      },
    });
    s.stop('Promoted user!');

    log.success('User has successfully been promoted!');
    process.exit(0);
  });

const migrateCmd = new Command('migrate')
  .description('Run pending database migrations')
  .action(async () => {
    logIntro(true);
    logger.info('Running migrations...');
    await migrate();
    logDivide();
    logger.info('Migrations completed!');
  });

export function createProgram(run: () => Promise<void>) {
  return program
    .name('statulo')
    .description('CLI to run or manage the Statulo server')
    .version(version)
    .action(run)
    .addCommand(initCmd)
    .addCommand(promoteCmd)
    .addCommand(migrateCmd);
}
