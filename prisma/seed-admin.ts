import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Create or update admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'byelyk@example.com' },
      update: { role: 'ADMIN' },
      create: {
        email: 'byelyk@example.com',
        displayName: 'byelyk',
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated:', adminUser);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
