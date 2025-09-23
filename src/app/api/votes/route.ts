import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { voteSchema } from '@/lib/validations';

// Helper function to get device ID from cookies
function getDeviceId(request: NextRequest): string {
  let deviceId = request.cookies.get('device-id')?.value;

  if (!deviceId) {
    // Generate a new device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return deviceId;
}

export async function POST(request: NextRequest) {
  try {
    const deviceId = getDeviceId(request);
    const body = await request.json();
    const validatedData = voteSchema.parse(body);

    // Check if device already voted on this target
    const existingVote = await db.vote.findFirst({
      where: {
        deviceId: deviceId,
        targetType: validatedData.targetType,
        ...(validatedData.targetType === 'ROOM'
          ? { roomId: validatedData.roomId }
          : { outfitId: validatedData.outfitId }),
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

      const response = NextResponse.json({
        message: 'Vote updated successfully',
        vote: updatedVote,
      });

      // Set device ID cookie
      response.cookies.set('device-id', deviceId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    } else {
      // Create new vote
      const newVote = await db.vote.create({
        data: {
          deviceId: deviceId,
          targetType: validatedData.targetType,
          ...(validatedData.targetType === 'ROOM'
            ? { roomId: validatedData.roomId }
            : { outfitId: validatedData.outfitId }),
          aestheticness: validatedData.aestheticness,
          cleanliness: validatedData.cleanliness,
          creativity: validatedData.creativity,
        },
      });

      const response = NextResponse.json({
        message: 'Vote submitted successfully',
        vote: newVote,
      });

      // Set device ID cookie
      response.cookies.set('device-id', deviceId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
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
    const deviceId = getDeviceId(request);
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
        deviceId: deviceId,
        targetType: targetType as 'ROOM' | 'OUTFIT',
        ...(targetType === 'ROOM'
          ? { roomId: targetId }
          : { outfitId: targetId }),
      },
    });

    const response = NextResponse.json({ vote });

    // Set device ID cookie
    response.cookies.set('device-id', deviceId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error fetching vote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote' },
      { status: 500 }
    );
  }
}
