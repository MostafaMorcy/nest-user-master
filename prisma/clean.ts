// prisma/clean.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  console.log('All users deleted');

  // Reset the sequence
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  console.log('ID sequence reset');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
