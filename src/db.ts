import { PrismaClient } from "@prisma/client";

export const rootPrisma = new PrismaClient({
  datasources: { db: { url: process.env["DATABASE_URL_WITH_ROOT"] } },
});

const prisma = new PrismaClient({
  datasources: { db: { url: process.env["DATABASE_URL_WITH_APP_USER"] } },
});

export const tenantGuardedPrisma = (tenantId: number) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, , result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId.toString()}, TRUE)`,
            prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'off', TRUE)`,
            query(args),
          ]);
          return result;
        },
      },
    },
  });
};

export const bypassedPrisma = () => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, , result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.tenant_id', ${(-1).toString()}, TRUE)`,
            prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
            query(args),
          ]);
          return result;
        },
      },
    },
  });
};

/**
 * This will reset the database by truncating all tables.
 * It also resets the sequence of the tables.
 */
export const resetTable = async (): Promise<void> => {
  const tablenames = await rootPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_catalog.pg_tables WHERE hastriggers = true;`;

  await rootPrisma.$transaction(
    tablenames.map(({ tablename }) =>
      rootPrisma.$queryRawUnsafe(
        `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`
      )
    )
  );
};
