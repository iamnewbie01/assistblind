import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
    return prisma;
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

export { prisma };
