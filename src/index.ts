import {
  bypassedPrisma,
  resetTable,
  rootPrisma,
  tenantGuardedPrisma,
} from "./db";

const main = async () => {
  console.debug("Start example.");
  console.debug("Reset DB.");
  await resetTable();

  const myTenantId = 1;
  const otherTenantId = 2;
  const bypassed = bypassedPrisma();
  const myTenantPrisma = tenantGuardedPrisma(myTenantId);
  const otherTenantPrisma = tenantGuardedPrisma(otherTenantId);

  // 1. Create new tenant and some projects using root prisma client.
  // Root user can do anything.
  await rootPrisma.tenant.createMany({
    data: [
      { name: "test-my-tenant", id: myTenantId },
      { name: "test-other-tenant", id: otherTenantId },
    ],
  });
  await rootPrisma.project.createMany({
    data: ["my-p1", "my-p2"].map((e) => ({ name: e, tenantId: myTenantId })),
  });
  await rootPrisma.project.createMany({
    data: ["other-p1"].map((e) => ({ name: e, tenantId: otherTenantId })),
  });

  console.debug();
  console.debug("### Check myTenantPrisma can get Projects");
  // Check RLS is working by trying to access projects below .
  // 2. Use my tenantPrisma.
  const myProjects = await myTenantPrisma.project.findMany();
  console.debug("myProjects", myProjects);

  console.debug();
  console.debug("### Check otherTenantPrismaProjects can not get Projects");
  // Check RLS is working by trying to access projects below .
  // 2. Use my tenantPrisma.
  const otherTenantPrismaProjects = await otherTenantPrisma.project.findMany();
  console.debug("otherTenantPrismaProjects", otherTenantPrismaProjects);

  console.debug();
  console.debug(
    "### Check bypassedPrisma can get the all Projects independent of tenant"
  );
  // 3. Use bypassedPrisma.
  const bypassedPrismaProjects = await bypassed.project.findMany();
  console.debug("bypassedPrismaProjects", bypassedPrismaProjects);
};

main();
