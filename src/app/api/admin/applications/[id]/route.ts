import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, filmingStatus } = body;

    const updateData: { status?: string; filmingStatus?: string } = {};

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      updateData.status = status;
    }

    if (filmingStatus && ['NOT_FILMED', 'FILMED'].includes(filmingStatus)) {
      updateData.filmingStatus = filmingStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const application = await db.roomApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.roomApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
