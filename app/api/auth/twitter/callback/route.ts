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
        new URL(`/dashboard?error=Twitter authentication failed: ${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=No authorization code received from Twitter', request.url)
      );
    }

    // For Twitter API v2 with PKCE, we need to handle the code verifier
    // In a real app, you'd store this in a secure session or database
    // For now, we'll pass it to the exchange method which will handle it client-side
    
    try {
      // Exchange code for access token (PKCE flow)
      const accessToken = await SocialMediaValidator.exchangeTwitterCode(code);

      // Validate Twitter account
      const validation = await SocialMediaValidator.validateTwitter('', accessToken);

      if (!validation.success || !validation.account) {
        return NextResponse.redirect(
          new URL(`/dashboard?error=${validation.error || 'Twitter validation failed'}`, request.url)
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
        new URL(`/dashboard?twitter_account=${accountData}`, request.url)
      );

    } catch (tokenError) {
      console.error('Twitter token exchange error:', tokenError);
      return NextResponse.redirect(
        new URL(`/dashboard?error=Twitter authentication failed: ${tokenError instanceof Error ? tokenError.message : 'Token exchange failed'}`, request.url)
      );
    }

  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/dashboard?error=Twitter authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`, request.url)
    );
  }
} 