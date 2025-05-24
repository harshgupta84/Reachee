import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaValidator } from '@/lib/social-media-validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?tab=profile&error=YouTube authentication failed: ${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?tab=profile&error=No authorization code received', request.url)
      );
    }

    try {
      const accessToken = await SocialMediaValidator.exchangeYouTubeCode(code);
      
      const validationResult = await SocialMediaValidator.validateYouTube('', accessToken);
      
      if (!validationResult.success || !validationResult.account) {
        return NextResponse.redirect(
          new URL(`/dashboard?tab=profile&error=${validationResult.error}`, request.url)
        );
      }

      const accountData = encodeURIComponent(JSON.stringify({
        platform: validationResult.account.platform,
        username: validationResult.account.username,
        accessToken: validationResult.account.accessToken,
        userId: validationResult.account.userId,
        followerCount: validationResult.account.followerCount,
        profileData: validationResult.account.profileData
      }));

      return NextResponse.redirect(
        new URL(`/dashboard?tab=profile&youtube_connected=true&account_data=${accountData}`, request.url)
      );

    } catch (tokenError) {
      return NextResponse.redirect(
        new URL(`/dashboard?tab=profile&error=Failed to process YouTube authentication: ${tokenError}`, request.url)
      );
    }

  } catch (error) {
    console.error('YouTube OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?tab=profile&error=YouTube authentication failed', request.url)
    );
  }
} 