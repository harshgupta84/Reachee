import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'OPEN';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const campaigns = await prisma.campaign.findMany({
      where: {
        status,
      },
      include: {
        brand: {
          select: {
            companyName: true,
            industry: true,
            logo: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const totalCampaigns = await prisma.campaign.count({
      where: {
        status,
      },
    });
    
    return NextResponse.json({
      status: 'success',
      data: {
        campaigns,
        meta: {
          total: totalCampaigns,
          page,
          limit,
          pages: Math.ceil(totalCampaigns / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch campaigns',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 