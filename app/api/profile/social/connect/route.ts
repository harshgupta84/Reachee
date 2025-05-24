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
    console.log('🔍 Social connect API called');
    
    const body = await request.json();
    console.log('📝 Request body:', JSON.stringify(body, null, 2));
    
    const validatedData = connectSocialSchema.parse(body);
    console.log('✅ Data validation passed');
    
    const {
      userId,
      platform,
      username,
      accessToken,
      followerCount,
      profileData,
    } = validatedData;

    console.log(`🔍 Looking for influencer profile with userId: ${userId}`);
    
    let influencerProfile = await prisma.influencerProfile.findUnique({
      where: { userId },
    });

    console.log('👤 Influencer profile found:', influencerProfile ? 'Yes' : 'No');

    if (!influencerProfile) {
      console.log('🔧 Creating missing influencer profile');
      influencerProfile = await prisma.influencerProfile.create({
        data: {
          userId,
          bio: '',
          location: '',
          categories: [],
          profileComplete: false,
        },
      });
      console.log('✅ Influencer profile created');
    }

    console.log(`🔍 Checking for existing platform: ${platform}`);
    
    const existingPlatform = await prisma.socialPlatform.findFirst({
      where: {
        influencerProfileId: influencerProfile.id,
        platform,
      },
    });

    console.log('🔄 Existing platform found:', existingPlatform ? 'Yes' : 'No');

    const platformData = {
      platform,
      username: username.replace('@', ''),
      url: generatePlatformUrl(platform, username),
      followers: followerCount || 0,
      accessToken,
      ...(profileData && { profileData }),
    };

    console.log('📊 Platform data to save:', JSON.stringify(platformData, null, 2));

    if (existingPlatform) {
      console.log('🔄 Updating existing platform');
      await prisma.socialPlatform.update({
        where: { id: existingPlatform.id },
        data: platformData,
      });
    } else {
      console.log('➕ Creating new platform connection');
      await prisma.socialPlatform.create({
        data: {
          ...platformData,
          influencerProfileId: influencerProfile.id,
        },
      });
    }

    console.log('✅ Platform connection successful');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error connecting social platform:', error);
    console.error('📍 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    if (error instanceof z.ZodError) {
      console.log('🔍 Zod validation error:', error.errors);
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