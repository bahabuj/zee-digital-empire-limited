import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

// GET - List all videos
export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - Upload a new video
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Client-side file size check (4.5MB for Vercel free tier)
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB for Vercel free tier
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds 4.5MB Vercel limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please use a smaller file or upgrade to Vercel Pro.` },
        { status: 413 }
      );
    }

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const filename = `videos/${timestamp}-${file.name}`;

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Create video record in database
    const video = await db.video.create({
      data: {
        title,
        description: description || null,
        filename: `${timestamp}-${file.name}`,
        url: blob.url,
        category: category || null,
        isFeatured,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      video
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video', details: error.message || String(error) },
      { status: 500 }
    );
  }
}