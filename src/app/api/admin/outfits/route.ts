import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { outfitSchema } from '@/lib/validations';

export async function GET() {
  try {
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
