import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalRooms,
      totalOutfits,
      totalApplications,
      pendingApplications,
      totalVotes,
    ] = await Promise.all([
      db.room.count(),
      db.outfit.count(),
      db.roomApplication.count(),
      db.roomApplication.count({ where: { status: 'PENDING' } }),
      db.vote.count(),
    ]);

    const stats = {
      totalRooms,
      totalOutfits,
      totalApplications,
      pendingApplications,
      totalVotes,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
