import { PrismaClient } from '@prisma/client';
import { conf } from '@/config';
import { logger } from '../log';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: conf.db.connection,
    },
  },
});

export async function isPrismaConnected() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    logger.error('Failed to healthcheck prisma');
    logger.error(err);
    return false;
  }
}
