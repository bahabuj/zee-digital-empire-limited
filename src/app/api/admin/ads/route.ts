import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET - List all advertisements
export async function GET() {
  try {
    const ads = await db.advertisement.findMany({
      orderBy: { priority: 'desc' }
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

// POST - Upload a new advertisement
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const company = formData.get('company') as string;
    const priority = parseInt(formData.get('priority') as string) || 0;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Check if file is either image or video
    const fileType = file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : null;

    if (!fileType) {
      return NextResponse.json(
        { error: 'File must be an image or video' },
        { status: 400 }
      );
    }

    // Check if we already have 7 ads
    const existingAds = await db.advertisement.count();
    if (existingAds >= 7) {
      return NextResponse.json(
        { error: 'Billboard can only contain up to 7 items. Please delete some first.' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'ads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filepath, buffer);

    // Generate default title if not provided
    const adTitle = title || `Advertisement ${existingAds + 1}`;

    // Create ad record in database (set dates to far past/future to always show)
    const now = new Date();
    const farPast = new Date(now.getFullYear() - 10, 0, 1); // 10 years ago
    const farFuture = new Date(now.getFullYear() + 10, 11, 31); // 10 years from now

    const ad = await db.advertisement.create({
      data: {
        title: adTitle,
        description: description || null,
        filename,
        url: `/uploads/ads/${filename}`,
        company: company || null,
        startDate: farPast,
        endDate: farFuture,
        priority,
        fileType,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      ad
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload advertisement', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
