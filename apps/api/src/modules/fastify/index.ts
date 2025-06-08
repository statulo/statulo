import type { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, FastifyInstance } from "fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { fastifySwagger } from "@fastify/swagger";
import type pino from "pino";
import { conf, version } from "@/config";
import { isApiError } from "@/utils/error";
import { logger } from "@/modules/log";
import { setupRoutes } from "@/routes/routes";

const log = logger.child({ svc: "fastify" });

export type StatuloFastifyInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  pino.Logger,
  ZodTypeProvider
>;

export async function setupFastify(): Promise<StatuloFastifyInstance> {
  log.info(`setting up fastify...`);

  const app = Fastify({
    loggerInstance: log,
    disableRequestLogging: true,
  });

  app.addHook("onResponse", (req, reply, done) => {
    req.log.info(
      {
        svc: "http",
        response: {
          url: req.raw.url,
          method: req.raw.method,
          statusCode: reply.raw.statusCode,
          elapsedTime: Math.round(reply.elapsedTime),
        },
      },
      "request completed",
    );
    done();
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Statulo",
        description: "API server for Statulo",
        version,
      },
      servers: [
        {
          url: "http://localhost:" + conf.server.port,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      void reply.status(400).send({
        errorType: "validation",
        errors: err.errors,
      });
      return;
    }

    if (isApiError(err)) {
      if (err.errorCode) {
        void reply.status(err.errorStatusCode).send({
          errorType: "code",
          code: err.errorCode,
          message: err.message,
        });
      } else {
        void reply.status(err.errorStatusCode).send({
          errorType: "message",
          message: err.message,
        });
      }
      return;
    }

    log.error("unhandled exception on server:", err);
    log.error(err.stack);
    void reply.status(500).send({
      errorType: "message",
      message: "Internal server error",
      ...(conf.logging.debug
        ? {
            trace: err.stack,

            errorMessage: err.toString(),
          }
        : {}),
    });
  });

  // plugins
  log.info(`setting up plugins`);
  const corsDomains = conf.server.cors.split(" ").filter(v => v.length > 0);
  await app.register(cors, {
    origin: corsDomains,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  });

  return app;
}

export function startFastify(app: StatuloFastifyInstance) {
  // listen to port
  log.info(`listening to port`);
  return new Promise<void>((resolve) => {
    app.listen(
      {
        port: conf.server.port,
        host: "0.0.0.0",
      },
      (err: any) => {
        if (err) {
          app.log.error(err);
          log.error(`Failed to setup fastify`);
          process.exit(1);
        }
        log.info(`fastify setup successfully`);
        resolve();
      },
    );
  });
}

export async function setupFastifyRoutes(app: StatuloFastifyInstance) {
  log.info(`setting up routes`);
  await app.register(
    async (api: StatuloFastifyInstance) => {
      await setupRoutes(api);
      app.route({
        url: "/swagger",
        method: "GET",
        handler: (req, res) => {
          return res.send(app.swagger());
        },
      });
    },
    {
      prefix: conf.server.basePath,
    },
  );
}
