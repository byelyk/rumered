import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Simple validation - just check the basics
    const {
      targetType,
      roomId,
      outfitId,
      aestheticness,
      cleanliness,
      creativity,
    } = body;

    if (!targetType || (targetType !== 'ROOM' && targetType !== 'OUTFIT')) {
      return NextResponse.json(
        { error: 'Invalid targetType' },
        { status: 400 }
      );
    }

    if (targetType === 'ROOM' && !roomId) {
      return NextResponse.json(
        { error: 'roomId required for ROOM votes' },
        { status: 400 }
      );
    }

    if (targetType === 'OUTFIT' && !outfitId) {
      return NextResponse.json(
        { error: 'outfitId required for OUTFIT votes' },
        { status: 400 }
      );
    }

    if (!aestheticness || !cleanliness || !creativity) {
      return NextResponse.json(
        { error: 'All scores required' },
        { status: 400 }
      );
    }

    // Check if device already voted on this target
    const existingVote = await db.vote.findFirst({
      where: {
        deviceId: deviceId,
        targetType: targetType,
        ...(targetType === 'ROOM'
          ? { roomId: roomId }
          : { outfitId: outfitId }),
      },
    });

    let vote;
    if (existingVote) {
      // Update existing vote
      vote = await db.vote.update({
        where: { id: existingVote.id },
        data: {
          aestheticness: Number(aestheticness),
          cleanliness: Number(cleanliness),
          creativity: Number(creativity),
        },
      });
    } else {
      // Create new vote
      vote = await db.vote.create({
        data: {
          deviceId: deviceId,
          targetType: targetType,
          ...(targetType === 'ROOM'
            ? { roomId: roomId }
            : { outfitId: outfitId }),
          aestheticness: Number(aestheticness),
          cleanliness: Number(cleanliness),
          creativity: Number(creativity),
        },
      });
    }

    const response = NextResponse.json({
      message: existingVote
        ? 'Vote updated successfully'
        : 'Vote submitted successfully',
      vote: vote,
    });

    // Set device ID cookie
    response.cookies.set('device-id', deviceId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
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
