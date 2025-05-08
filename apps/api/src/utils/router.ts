import type {
  FastifyPluginAsync,
  RawServerDefault,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type pino from "pino";
import type { StatuloFastifyInstance } from "@/modules/fastify";

export type RegisterPlugin = FastifyPluginAsync<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider,
  pino.Logger
>;

export function makeRouter(cb: (app: StatuloFastifyInstance) => void): {
  register: RegisterPlugin;
} {
  return {
    register: async (app) => {
      cb(app);
    },
  };
}
