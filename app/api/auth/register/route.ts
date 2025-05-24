import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INFLUENCER', 'BRAND']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = registerSchema.parse(body);
    const { name, email, password, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // For brands, use a placeholder name that will be updated during onboarding
    const userName = role === 'BRAND' ? (name || 'Brand User') : name;

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userName,
        email,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Create corresponding profile based on role
    if (role === 'INFLUENCER') {
      await prisma.influencerProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      await prisma.brandProfile.create({
        data: {
          userId: user.id,
          companyName: '', // Will be filled during onboarding
        },
      });
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        role,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    
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