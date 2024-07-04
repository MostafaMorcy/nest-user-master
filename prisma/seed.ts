// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1Data = {
    basicInfo: {
      name: 'user one',
      address: {
        city: 'City One',
        streetNumber: 123,
      },
    },
    role: Role.USER,
  };

  const user2Data = {
    basicInfo: {
      name: 'user two',
      address: {
        city: 'City Two',
        streetNumber: 456,
      },
    },
    role: Role.ADMIN,
  };

  await prisma.user.create({ data: user1Data });
  await prisma.user.create({ data: user2Data });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
