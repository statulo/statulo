import { version } from '@/config';
import { isPrismaConnected } from '@/modules/db';
import { handle } from '@/utils/handle';
import { makeRouter } from '@/utils/router';

interface Check {
  name: string;
  success: boolean;
}

async function healthcheck(): Promise<Check[]> {
  return [
    {
      name: 'db',
      success: await isPrismaConnected(),
    },
  ];
}

export const indexRouter = makeRouter((app) => {
  app.get(
    '',
    {
      schema: {
        description: 'Healthcheck',
      },
    },
    handle(async ({ res }) => {
      const checks = await healthcheck();
      const isHealthy = checks.every(v => v.success);
      void res.status(isHealthy ? 200 : 500);
      return {
        message: 'API server is working!',
        version,
        checks,
      };
    }),
  );
});
