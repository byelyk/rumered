import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { id: 'admin-user-id' },
    update: {},
    create: {
      id: 'admin-user-id',
      email: 'admin@rumered.app',
      displayName: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create sample rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        displayName: 'Cougar Village II • Room 512 (Jayden)',
        hallName: 'Cougar Village II',
        roomNumber: '512',
        school: 'University of Houston',
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.room.create({
      data: {
        displayName: 'West Campus • Room 203 (Sarah)',
        hallName: 'West Campus',
        roomNumber: '203',
        school: 'University of Texas',
        imageUrl:
          'https://images.unsplash.com/photo-1555854877-bab0ef8c9b7c?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.room.create({
      data: {
        displayName: 'North Tower • Room 101 (Alex)',
        hallName: 'North Tower',
        roomNumber: '101',
        school: 'Texas A&M University',
        imageUrl:
          'https://images.unsplash.com/photo-1560185127-6c1899ba2181?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.room.create({
      data: {
        displayName: 'South Hall • Room 315 (Maya)',
        hallName: 'South Hall',
        roomNumber: '315',
        school: 'Rice University',
        imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.room.create({
      data: {
        displayName: 'East Wing • Room 422 (Jordan)',
        hallName: 'East Wing',
        roomNumber: '422',
        school: 'Baylor University',
        imageUrl:
          'https://images.unsplash.com/photo-1555854877-bab0ef8c9b7c?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
  ]);

  console.log('Created rooms:', rooms.length);

  // Create sample outfits
  const outfits = await Promise.all([
    prisma.outfit.create({
      data: {
        title: 'Casual Friday Vibes',
        imageUrl:
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.outfit.create({
      data: {
        title: 'Campus Chic',
        imageUrl:
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.outfit.create({
      data: {
        title: 'Study Session Style',
        imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.outfit.create({
      data: {
        title: 'Weekend Warrior',
        imageUrl:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
    prisma.outfit.create({
      data: {
        title: 'Library Ready',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop',
        isPublished: true,
      },
    }),
  ]);

  console.log('Created outfits:', outfits.length);

  // Create sample votes
  const sampleVotes = [
    // Room votes
    { roomId: rooms[0].id, aestheticness: 8, cleanliness: 9, creativity: 7 },
    { roomId: rooms[0].id, aestheticness: 9, cleanliness: 8, creativity: 8 },
    { roomId: rooms[1].id, aestheticness: 7, cleanliness: 9, creativity: 9 },
    { roomId: rooms[1].id, aestheticness: 8, cleanliness: 7, creativity: 8 },
    { roomId: rooms[2].id, aestheticness: 9, cleanliness: 8, creativity: 9 },
    { roomId: rooms[2].id, aestheticness: 8, cleanliness: 9, creativity: 7 },
    { roomId: rooms[3].id, aestheticness: 7, cleanliness: 8, creativity: 8 },
    { roomId: rooms[3].id, aestheticness: 8, cleanliness: 7, creativity: 9 },
    { roomId: rooms[4].id, aestheticness: 9, cleanliness: 9, creativity: 8 },
    { roomId: rooms[4].id, aestheticness: 8, cleanliness: 8, creativity: 8 },

    // Outfit votes
    {
      outfitId: outfits[0].id,
      aestheticness: 8,
      cleanliness: 9,
      creativity: 7,
    },
    {
      outfitId: outfits[0].id,
      aestheticness: 7,
      cleanliness: 8,
      creativity: 8,
    },
    {
      outfitId: outfits[1].id,
      aestheticness: 9,
      cleanliness: 8,
      creativity: 9,
    },
    {
      outfitId: outfits[1].id,
      aestheticness: 8,
      cleanliness: 9,
      creativity: 7,
    },
    {
      outfitId: outfits[2].id,
      aestheticness: 7,
      cleanliness: 8,
      creativity: 8,
    },
    {
      outfitId: outfits[2].id,
      aestheticness: 8,
      cleanliness: 7,
      creativity: 9,
    },
    {
      outfitId: outfits[3].id,
      aestheticness: 9,
      cleanliness: 9,
      creativity: 8,
    },
    {
      outfitId: outfits[3].id,
      aestheticness: 8,
      cleanliness: 8,
      creativity: 8,
    },
    {
      outfitId: outfits[4].id,
      aestheticness: 7,
      cleanliness: 9,
      creativity: 7,
    },
    {
      outfitId: outfits[4].id,
      aestheticness: 8,
      cleanliness: 8,
      creativity: 8,
    },
  ];

  const votes = await Promise.all(
    sampleVotes.map((vote) => {
      return prisma.vote.create({
        data: {
          userId: adminUser.id,
          targetType: vote.roomId ? 'ROOM' : 'OUTFIT',
          roomId: vote.roomId,
          outfitId: vote.outfitId,
          aestheticness: vote.aestheticness,
          cleanliness: vote.cleanliness,
          creativity: vote.creativity,
        },
      });
    })
  );

  console.log('Created votes:', votes.length);

  // Create sample room applications
  const applications = await Promise.all([
    prisma.roomApplication.create({
      data: {
        userId: adminUser.id,
        fullName: 'Emma Johnson',
        hallName: 'Maple Hall',
        roomNumber: '205',
        school: 'University of Houston',
        instagram: '@emma_j',
        message:
          'My room has a really cool setup with LED lights and a gaming station!',
        status: 'PENDING',
      },
    }),
    prisma.roomApplication.create({
      data: {
        userId: adminUser.id,
        fullName: 'Michael Chen',
        hallName: 'Oak Residence',
        roomNumber: '312',
        school: 'Rice University',
        instagram: '@mike_chen',
        message:
          'I transformed my dorm into a minimalist study space with plants everywhere.',
        status: 'APPROVED',
      },
    }),
    prisma.roomApplication.create({
      data: {
        userId: adminUser.id,
        fullName: 'Sofia Rodriguez',
        hallName: 'Pine Tower',
        roomNumber: '108',
        school: 'Texas A&M University',
        instagram: '@sofia_r',
        message:
          'My room has a bohemian vibe with tapestries and fairy lights.',
        status: 'REJECTED',
      },
    }),
  ]);

  console.log('Created applications:', applications.length);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
