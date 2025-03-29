import type { FastifyInstance } from 'fastify';
import { indexRouter } from '@/routes/v0';

export async function setupRoutes(app: FastifyInstance) {
  await app.register(indexRouter.register);
}
