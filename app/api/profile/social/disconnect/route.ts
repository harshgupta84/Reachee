import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformId } = body;

    if (!platformId) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    await prisma.socialPlatform.delete({
      where: { id: platformId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting social platform:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 