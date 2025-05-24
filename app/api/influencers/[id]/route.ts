import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        influencerProfile: {
          include: {
            socialPlatforms: true,
            metrics: true,
          },
        },
      },
    });

    if (!user || !user.influencerProfile) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }

    const totalFollowers = user.influencerProfile.socialPlatforms.reduce(
      (sum, platform) => sum + platform.followers, 0
    );

    const platformsData = user.influencerProfile.socialPlatforms.map(platform => ({
      platform: platform.platform,
      username: platform.username,
      followers: platform.followers,
    }));

    const influencer = {
      id: user.influencerProfile.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.influencerProfile.bio,
      location: user.influencerProfile.location,
      categories: user.influencerProfile.categories,
      verified: user.influencerProfile.verified,
      profileComplete: user.influencerProfile.profileComplete,
      totalFollowers,
      averageEngagement: user.influencerProfile.metrics?.averageEngagement,
      socialPlatforms: platformsData,
      createdAt: user.createdAt,
    };

    return NextResponse.json(influencer);

  } catch (error) {
    console.error('Error fetching influencer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencer' },
      { status: 500 }
    );
  }
} 