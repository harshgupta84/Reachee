import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const location = searchParams.get('location');
    const categories = searchParams.get('categories')?.split(',');
    const minFollowers = searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')!) : undefined;
    const maxFollowers = searchParams.get('maxFollowers') ? parseInt(searchParams.get('maxFollowers')!) : undefined;
    const verified = searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined;
    const platforms = searchParams.get('platforms')?.split(',');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc';

    const where: any = {
      influencerProfile: {
        isNot: null,
      },
    };

    const influencerProfileWhere: any = {};

    if (location) {
      influencerProfileWhere.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (categories && categories.length > 0) {
      influencerProfileWhere.categories = {
        hasSome: categories,
      };
    }

    if (verified !== undefined) {
      influencerProfileWhere.verified = verified;
    }

    if (Object.keys(influencerProfileWhere).length > 0) {
      where.influencerProfile = {
        isNot: null,
        ...influencerProfileWhere,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { 
          influencerProfile: { 
            isNot: null,
            bio: { contains: search, mode: 'insensitive' } 
          } 
        },
      ];
    }

    let orderBy: any = {};
    
    switch (sortField) {
      case 'name':
        orderBy.name = sortDirection;
        break;
      case 'createdAt':
        orderBy.createdAt = sortDirection;
        break;
      default:
        orderBy.createdAt = sortDirection;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        influencerProfile: {
          include: {
            socialPlatforms: true,
            metrics: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.user.count({ where });

    const influencers = users
      .map(user => {
        if (!user.influencerProfile) return null;

        const totalFollowers = user.influencerProfile.socialPlatforms?.reduce(
          (sum, platform) => sum + (platform.followers || 0), 0
        ) || 0;

        const platformsData = user.influencerProfile.socialPlatforms?.map(platform => ({
          platform: platform.platform,
          username: platform.username,
          followers: platform.followers || 0,
        })) || [];

        const filteredByFollowers = minFollowers || maxFollowers
          ? totalFollowers >= (minFollowers || 0) && 
            totalFollowers <= (maxFollowers || Infinity)
          : true;

        const engagement = user.influencerProfile.metrics?.averageEngagement;

        const hasPlatform = platforms?.length
          ? platforms.some(platform => 
              platformsData.some(p => p.platform.toLowerCase() === platform.toLowerCase())
            )
          : true;

        if (!filteredByFollowers || !hasPlatform) {
          return null;
        }

        return {
          id: user.influencerProfile.id,
          userId: user.id,
          name: user.name || 'Unknown',
          email: user.email,
          image: user.image,
          bio: user.influencerProfile.bio,
          location: user.influencerProfile.location,
          categories: user.influencerProfile.categories || [],
          verified: user.influencerProfile.verified || false,
          profileComplete: user.influencerProfile.profileComplete || false,
          totalFollowers,
          averageEngagement: engagement || 0,
          socialPlatforms: platformsData,
          createdAt: user.createdAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      influencers,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });

  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch influencers',
        details: error instanceof Error ? error.message : 'Unknown error',
        influencers: [],
        total: 0,
        page: 1,
        limit: 12,
        hasMore: false,
      },
      { status: 500 }
    );
  }
} 