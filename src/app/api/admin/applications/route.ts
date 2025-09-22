import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await db.roomApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
