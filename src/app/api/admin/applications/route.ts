import { NextResponse } from 'next/server';
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const applicationsDir = join(process.cwd(), 'applications');

    if (!existsSync(applicationsDir)) {
      return NextResponse.json({ applications: [] });
    }

    const files = readdirSync(applicationsDir)
      .filter((file) => file.endsWith('.json'))
      .sort((a, b) => {
        const statA = statSync(join(applicationsDir, a));
        const statB = statSync(join(applicationsDir, b));
        return statB.mtime.getTime() - statA.mtime.getTime(); // Sort by newest first
      });

    const applications = files
      .map((file) => {
        try {
          const filePath = join(applicationsDir, file);
          const data = JSON.parse(readFileSync(filePath, 'utf8'));
          return data;
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
