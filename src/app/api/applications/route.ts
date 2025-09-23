import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { roomApplicationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = roomApplicationSchema.parse(body);

    // Create application in database
    const application = await db.roomApplication.create({
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For anonymous system, return empty array since we don't track user applications
    return NextResponse.json({ applications: [] });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
