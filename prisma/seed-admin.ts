import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Create or update admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'jatelo@example.com' },
      update: { role: 'ADMIN' },
      create: {
        email: 'jatelo@example.com',
        displayName: 'jatelo',
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
