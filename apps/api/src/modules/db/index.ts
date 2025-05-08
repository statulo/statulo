import { PrismaClient } from "@prisma/client";
import { logger } from "../log";
import { conf } from "@/config";

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
    logger.error("Failed to healthcheck prisma");
    logger.error(err);
    return false;
  }
}
