import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateInfluencerSchema = z.object({
  userId: z.string(),
  type: z.literal('INFLUENCER'),
  bio: z.string(),
  location: z.string(),
  contentCategories: z.string(),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  facebookHandle: z.string().optional(),
  minimumRate: z.string(),
  preferredContentTypes: z.string(),
});

const updateBrandSchema = z.object({
  userId: z.string(),
  type: z.literal('BRAND'),
  companyName: z.string(),
  industry: z.string(),
  website: z.string().optional(),
  description: z.string(),
  preferredRegions: z.string(),
  preferredCategories: z.string(),
  budget: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.type === 'INFLUENCER') {
      const validatedData = updateInfluencerSchema.parse(body);
      const {
        userId,
        bio,
        location,
        contentCategories,
        instagramHandle,
        tiktokHandle,
        youtubeHandle,
        twitterHandle,
        facebookHandle,
        minimumRate,
        preferredContentTypes,
      } = validatedData;

      // Get the influencer profile first
      const influencerProfile = await prisma.influencerProfile.findUnique({
        where: { userId },
      });

      if (!influencerProfile) {
        return NextResponse.json(
          { error: 'Influencer profile not found' },
          { status: 404 }
        );
      }

      // Update influencer profile
      await prisma.influencerProfile.update({
        where: { userId },
        data: {
          bio,
          location,
          categories: contentCategories.split(',').map(c => c.trim()).filter(Boolean),
        },
      });

      // Handle social platforms
      const platforms = [
        { platform: 'Instagram', handle: instagramHandle },
        { platform: 'TikTok', handle: tiktokHandle },
        { platform: 'YouTube', handle: youtubeHandle },
        { platform: 'Twitter', handle: twitterHandle },
        { platform: 'Facebook', handle: facebookHandle },
      ];

      for (const { platform, handle } of platforms) {
        if (handle) {
          // Check if platform already exists
          const existingPlatform = await prisma.socialPlatform.findFirst({
            where: {
              influencerProfileId: influencerProfile.id,
              platform,
            },
          });

          if (existingPlatform) {
            await prisma.socialPlatform.update({
              where: { id: existingPlatform.id },
              data: {
                username: handle.replace('@', ''),
                url: `https://${platform.toLowerCase()}.com/${handle.replace('@', '')}`,
              },
            });
          } else {
            await prisma.socialPlatform.create({
              data: {
                influencerProfileId: influencerProfile.id,
                platform,
                username: handle.replace('@', ''),
                url: `https://${platform.toLowerCase()}.com/${handle.replace('@', '')}`,
                followers: 0,
              },
            });
          }
        }
      }

      // Update or create metrics
      const existingMetrics = await prisma.metrics.findUnique({
        where: { influencerProfileId: influencerProfile.id },
      });

      if (existingMetrics) {
        await prisma.metrics.update({
          where: { influencerProfileId: influencerProfile.id },
          data: {
            contentCategories: preferredContentTypes.split(',').map(c => c.trim()).filter(Boolean),
          },
        });
      } else {
        await prisma.metrics.create({
          data: {
            influencerProfileId: influencerProfile.id,
            contentCategories: preferredContentTypes.split(',').map(c => c.trim()).filter(Boolean),
            averageEngagement: 0,
          },
        });
      }
      
    } else if (body.type === 'BRAND') {
      const validatedData = updateBrandSchema.parse(body);
      const {
        userId,
        companyName,
        industry,
        website,
        description,
        preferredRegions,
        preferredCategories,
        budget,
      } = validatedData;

      // Update brand profile
      await prisma.brandProfile.update({
        where: { userId },
        data: {
          companyName,
          industry,
          website: website || null,
          description,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    
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