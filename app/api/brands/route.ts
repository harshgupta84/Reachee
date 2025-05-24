import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const whereClause: any = {
      profileComplete: true,
    };
    
    if (industry && industry !== 'all') {
      whereClause.industry = industry;
    }
    
    const brands = await prisma.brandProfile.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: [
        { verified: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    const totalBrands = await prisma.brandProfile.count({
      where: whereClause,
    });
    
    return NextResponse.json({
      status: 'success',
      data: {
        brands,
        meta: {
          total: totalBrands,
          page,
          limit,
          pages: Math.ceil(totalBrands / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch brands',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 