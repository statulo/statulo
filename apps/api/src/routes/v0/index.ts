import { version } from "@/config";
import { isPrismaConnected } from "@/modules/db";
import { handle } from "@/utils/handle";
import { makeRouter } from "@/utils/router";

type Check = {
  name: string;
  success: boolean;
};

async function healthcheck(): Promise<Check[]> {
  return [
    {
      name: "db",
      success: await isPrismaConnected(),
    },
  ];
}

export const indexRouter = makeRouter((app) => {
  app.get(
    "/",
    {
      schema: {
        description: "Index route",
      },
    },
    handle(async ({ res }) => {
      void res.status(404);
      return {
        message: "Welcome to Statulo API! Please check the documentation for more information.",
        version,
      };
    }),
  );
  app.get(
    "/healthz",
    {
      schema: {
        description: "Health check",
      },
    },
    handle(async ({ res }) => {
      const checks = await healthcheck();
      const isHealthy = checks.every(v => v.success);
      void res.status(isHealthy ? 200 : 503);
      return {
        message: isHealthy ? "API is healthy" : "API is unhealthy",
        isHealthy,
        version,
        checks,
      };
    }),
  );
});
