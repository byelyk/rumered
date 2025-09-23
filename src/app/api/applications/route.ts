import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { roomApplicationSchema } from '@/lib/validations';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = roomApplicationSchema.parse(body);

    // Create application in database
    const application = await db.roomApplication.create({
      data: {
        userId: 'anonymous', // Use anonymous for cookie-based system
        ...validatedData,
      },
    });

    // Also save to file system for easy viewing
    try {
      const applicationsDir = join(process.cwd(), 'applications');
      mkdirSync(applicationsDir, { recursive: true });

      const fileName = `application_${application.id}_${Date.now()}.json`;
      const filePath = join(applicationsDir, fileName);

      const fileData = {
        id: application.id,
        submittedAt: new Date().toISOString(),
        status: application.status,
        ...validatedData,
      };

      writeFileSync(filePath, JSON.stringify(fileData, null, 2));
      console.log(`Application saved to: ${filePath}`);
    } catch (fileError) {
      console.error('Error saving application to file:', fileError);
      // Don't fail the request if file saving fails
    }

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
