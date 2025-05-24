import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const brandOnboardingSchema = z.object({
  userId: z.string(),
  companyName: z.string().min(2),
  industry: z.string().min(2),
  website: z.string().url(),
  description: z.string().min(10),
  preferredRegions: z.string().min(2),
  preferredCategories: z.string().min(2),
  paymentMethod: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = brandOnboardingSchema.parse(body);
    const { 
      userId, 
      companyName, 
      industry, 
      website, 
      description, 
      preferredRegions, 
      preferredCategories, 
      paymentMethod 
    } = validatedData;

    // Update brand profile
    const brandProfile = await prisma.brandProfile.update({
      where: { userId },
      data: {
        companyName,
        industry,
        website,
        description,
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

    return NextResponse.json({
      success: true,
      user: {
        ...brandProfile.user,
        role: 'BRAND',
        brandProfile: {
          ...brandProfile,
          user: undefined, // Remove nested user to avoid circular reference
        },
      },
    });

  } catch (error) {
    console.error('Brand onboarding error:', error);
    
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