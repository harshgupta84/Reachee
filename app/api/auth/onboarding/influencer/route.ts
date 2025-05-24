import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const influencerOnboardingSchema = z.object({
  userId: z.string(),
  bio: z.string().min(10),
  country: z.string().min(2),
  city: z.string().min(2),
  contentCategories: z.string().min(2),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  minimumRate: z.string().min(1),
  preferredContentTypes: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = influencerOnboardingSchema.parse(body);
    const { 
      userId, 
      bio, 
      country, 
      city, 
      contentCategories, 
      instagramHandle, 
      tiktokHandle, 
      youtubeHandle, 
      minimumRate, 
      preferredContentTypes 
    } = validatedData;

    // Update influencer profile
    const influencerProfile = await prisma.influencerProfile.update({
      where: { userId },
      data: {
        bio,
        location: `${city}, ${country}`,
        categories: contentCategories.split(',').map(cat => cat.trim()),
        profileComplete: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create social platforms if provided
    const socialPlatforms = [];
    
    if (instagramHandle) {
      socialPlatforms.push({
        platform: 'Instagram',
        username: instagramHandle,
        url: `https://instagram.com/${instagramHandle.replace('@', '')}`,
        followers: 0, // Default value, can be updated later
        influencerProfileId: influencerProfile.id,
      });
    }
    
    if (tiktokHandle) {
      socialPlatforms.push({
        platform: 'TikTok',
        username: tiktokHandle,
        url: `https://tiktok.com/@${tiktokHandle.replace('@', '')}`,
        followers: 0,
        influencerProfileId: influencerProfile.id,
      });
    }
    
    if (youtubeHandle) {
      socialPlatforms.push({
        platform: 'YouTube',
        username: youtubeHandle,
        url: youtubeHandle.startsWith('http') ? youtubeHandle : `https://youtube.com/@${youtubeHandle}`,
        followers: 0,
        influencerProfileId: influencerProfile.id,
      });
    }

    // Create social platforms
    if (socialPlatforms.length > 0) {
      await prisma.socialPlatform.createMany({
        data: socialPlatforms,
      });
    }

    // Create or update metrics
    await prisma.metrics.upsert({
      where: { influencerProfileId: influencerProfile.id },
      update: {
        contentCategories: preferredContentTypes.split(',').map(type => type.trim()),
      },
      create: {
        influencerProfileId: influencerProfile.id,
        contentCategories: preferredContentTypes.split(',').map(type => type.trim()),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...influencerProfile.user,
        role: 'INFLUENCER',
        influencerProfile: {
          ...influencerProfile,
          user: undefined, // Remove nested user to avoid circular reference
        },
      },
    });

  } catch (error) {
    console.error('Influencer onboarding error:', error);
    
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