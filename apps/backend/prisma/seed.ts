import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default roles
  const roles = [
    {
      name: 'admin',
      description: 'Full system access with all permissions',
    },
    {
      name: 'author',
      description: 'Can create and manage their own posts',
    },
    {
      name: 'user',
      description: 'Basic user access with limited permissions',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 