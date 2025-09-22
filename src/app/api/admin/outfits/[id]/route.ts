import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/auth';
import { db } from '@/lib/db';
import { outfitSchema } from '@/lib/validations';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = outfitSchema.parse(body);

    const outfit = await db.outfit.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Outfit updated successfully',
      outfit,
    });
  } catch (error) {
    console.error('Error updating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to update outfit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await db.outfit.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Outfit deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    return NextResponse.json(
      { error: 'Failed to delete outfit' },
      { status: 500 }
    );
  }
}
