import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { roomSchema } from '@/lib/validations';

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      include: {
        votes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching admin rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = roomSchema.parse(body);

    const room = await db.room.create({
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
