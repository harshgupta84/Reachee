import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaValidator } from '@/lib/social-media-validation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=LinkedIn authentication failed: ${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=No authorization code received from LinkedIn', request.url)
      );
    }

    // Exchange code for access token
    const accessToken = await SocialMediaValidator.exchangeLinkedInCode(code);

    // Validate LinkedIn account
    const validation = await SocialMediaValidator.validateLinkedIn('', accessToken);

    if (!validation.success || !validation.account) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${validation.error || 'LinkedIn validation failed'}`, request.url)
      );
    }

    const account = validation.account;

    // TODO: Get user ID from session/auth
    // For now, we'll redirect with account data
    const accountData = encodeURIComponent(JSON.stringify({
      platform: account.platform,
      username: account.username,
      followers: account.followerCount,
      accessToken: account.accessToken,
      profileData: account.profileData,
      isValid: account.isValid
    }));

    return NextResponse.redirect(
      new URL(`/dashboard?linkedin_account=${accountData}`, request.url)
    );

  } catch (error) {
    console.error('LinkedIn OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/dashboard?error=LinkedIn authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`, request.url)
    );
  }
} 