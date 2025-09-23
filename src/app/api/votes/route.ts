import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/auth';
import { db } from '@/lib/db';
import { voteSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = voteSchema.parse(body);

    // Check if user already voted on this target
    const existingVote = await db.vote.findFirst({
      where: {
        userId: (user as { id: string }).id,
        targetType: validatedData.targetType,
        ...(validatedData.targetType === 'ROOM'
          ? { roomId: validatedData.targetId }
          : { outfitId: validatedData.targetId }),
      },
    });

    if (existingVote) {
      // Update existing vote
      const updatedVote = await db.vote.update({
        where: { id: existingVote.id },
        data: {
          aestheticness: validatedData.aestheticness,
          cleanliness: validatedData.cleanliness,
          creativity: validatedData.creativity,
        },
      });

      return NextResponse.json({
        message: 'Vote updated successfully',
        vote: updatedVote,
      });
    } else {
      // Create new vote
      const newVote = await db.vote.create({
        data: {
          userId: (user as { id: string }).id,
          targetType: validatedData.targetType,
          ...(validatedData.targetType === 'ROOM'
            ? { roomId: validatedData.targetId }
            : { outfitId: validatedData.targetId }),
          aestheticness: validatedData.aestheticness,
          cleanliness: validatedData.cleanliness,
          creativity: validatedData.creativity,
        },
      });

      return NextResponse.json({
        message: 'Vote submitted successfully',
        vote: newVote,
      });
    }
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    const targetId = searchParams.get('targetId');

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    const vote = await db.vote.findFirst({
      where: {
        userId: (user as { id: string }).id,
        targetType: targetType as 'ROOM' | 'OUTFIT',
        ...(targetType === 'ROOM'
          ? { roomId: targetId }
          : { outfitId: targetId }),
      },
    });

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error fetching vote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote' },
      { status: 500 }
    );
  }
}
