import { NextRequest, NextResponse } from 'next/server';

// Simple access code - you can change this to any code you prefer
const ACCESS_CODE = 'admin2024';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    // Validate the access code
    if (code === ACCESS_CODE) {
      return NextResponse.json({
        success: true,
        message: 'Access granted',
        token: 'valid'
      });
    } else {
      return NextResponse.json.json(
        { error: 'Invalid access code' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'This endpoint requires POST request with code in body'
  });
}
