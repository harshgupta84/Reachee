import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const connectSocialSchema = z.object({
  userId: z.string(),
  platform: z.string(),
  username: z.string(),
  accessToken: z.string().optional(),
  followerCount: z.number().optional(),
  profileData: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = connectSocialSchema.parse(body);
    
    const {
      userId,
      platform,
      username,
      accessToken,
      followerCount,
      profileData,
    } = validatedData;

    // Get the influencer profile
    const influencerProfile = await prisma.influencerProfile.findUnique({
      where: { userId },
    });

    if (!influencerProfile) {
      return NextResponse.json(
        { error: 'Influencer profile not found' },
        { status: 404 }
      );
    }

    // Check if platform already exists
    const existingPlatform = await prisma.socialPlatform.findFirst({
      where: {
        influencerProfileId: influencerProfile.id,
        platform,
      },
    });

    const platformData = {
      platform,
      username: username.replace('@', ''),
      url: generatePlatformUrl(platform, username),
      followers: followerCount || 0,
      accessToken,
      ...(profileData && { profileData }),
    };

    if (existingPlatform) {
      // Update existing platform
      await prisma.socialPlatform.update({
        where: { id: existingPlatform.id },
        data: platformData,
      });
    } else {
      // Create new platform connection
      await prisma.socialPlatform.create({
        data: {
          ...platformData,
          influencerProfileId: influencerProfile.id,
        },
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error connecting social platform:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generatePlatformUrl(platform: string, username: string): string {
  const cleanUsername = username.replace('@', '');
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return `https://instagram.com/${cleanUsername}`;
    case 'facebook':
      return `https://facebook.com/${cleanUsername}`;
    case 'youtube':
      if (cleanUsername.startsWith('UC') && cleanUsername.length === 24) {
        return `https://youtube.com/channel/${cleanUsername}`;
      } else {
        return `https://youtube.com/@${cleanUsername}`;
      }
    case 'twitter':
      return `https://twitter.com/${cleanUsername}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanUsername}`;
    default:
      return `https://${platform.toLowerCase()}.com/${cleanUsername}`;
  }
} 