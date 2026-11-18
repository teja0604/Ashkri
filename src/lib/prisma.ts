import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client Singleton
 * 
 * Prevents multiple instances of Prisma Client from being created
 * during Next.js Hot Module Replacement (HMR) in development.
 * 
 * Configured for Neon PostgreSQL connection pooling in ap-southeast-1.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
