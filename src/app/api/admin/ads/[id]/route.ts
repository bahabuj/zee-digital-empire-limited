import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

// DELETE - Delete an advertisement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find ad
    const ad = await db.advertisement.findUnique({
      where: { id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'ads', ad.filename);
    try {
      await unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await db.advertisement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}

// PATCH - Update advertisement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update ad
    const ad = await db.advertisement.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.company !== undefined && { company: body.company }),
        ...(body.startDate !== undefined && { startDate: new Date(body.startDate) }),
        ...(body.endDate !== undefined && { endDate: new Date(body.endDate) }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.isActive !== undefined && { isActive: body.isActive })
      }
    });

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}
