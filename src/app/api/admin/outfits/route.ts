import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/auth';
import { db } from '@/lib/db';
import { outfitSchema } from '@/lib/validations';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user || (user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const outfits = await db.outfit.findMany({
      include: {
        votes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ outfits });
  } catch (error) {
    console.error('Error fetching admin outfits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outfits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user || (user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = outfitSchema.parse(body);

    const outfit = await db.outfit.create({
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Outfit created successfully',
      outfit,
    });
  } catch (error) {
    console.error('Error creating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to create outfit' },
      { status: 500 }
    );
  }
}
