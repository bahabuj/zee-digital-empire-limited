import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

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
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const company = formData.get('company') as string;
    const priority = parseInt(formData.get('priority') as string) || 0;

    console.log('Received ad upload request:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Client-side file size check (4.5MB for Vercel free tier)
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB for Vercel free tier
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds 4.5MB Vercel limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please use a smaller file or upgrade to Vercel Pro.` },
        { status: 413, headers: corsHeaders }
      );
    }

    // Check if file is either image or video
    const fileType = file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : null;

    if (!fileType) {
      return NextResponse.json(
        { error: 'File must be an image or video' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if we already have 7 ads
    const existingAds = await db.advertisement.count();
    if (existingAds >= 7) {
      return NextResponse.json(
        { error: 'Billboard can only contain up to 7 items. Please delete some first.' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Uploading file to Vercel Blob...');

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const filename = `ads/${timestamp}-${file.name}`;

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('File uploaded to Blob:', blob.url);

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
        filename: `${timestamp}-${file.name}`,
        url: blob.url,
        company: company || null,
        startDate: farPast,
        endDate: farFuture,
        priority,
        fileType,
        isActive: true
      }
    });

    console.log('Ad created in database:', ad.id);

    return NextResponse.json({
      success: true,
      ad
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload advertisement', details: error.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}