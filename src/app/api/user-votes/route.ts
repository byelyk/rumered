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

export async function GET(request: NextRequest) {
  try {
    const deviceId = getDeviceId(request);

    const votes = await db.vote.findMany({
      where: {
        deviceId: deviceId,
      },
      include: {
        room: {
          select: {
            id: true,
            displayName: true,
          },
        },
        outfit: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response = NextResponse.json({ votes });

    // Set device ID cookie
    response.cookies.set('device-id', deviceId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
