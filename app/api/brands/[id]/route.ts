import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const brandId = params.id;
    
    const brand = await prisma.brandProfile.findUnique({
      where: {
        id: brandId,
      },
    });
    
    if (!brand) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Brand not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      data: {
        brand,
      },
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch brand',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 