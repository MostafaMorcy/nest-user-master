import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { name: 'user one' },
    update: {},
    create: {
      name: 'user one',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { name: 'user two' },
    update: {},
    create: {
      name: 'user two',
      role: 'ADMIN',
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
