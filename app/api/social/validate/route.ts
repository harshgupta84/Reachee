import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaValidator } from '@/lib/social-media-validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, username, accessToken } = body;

    if (!platform || !username) {
      return NextResponse.json(
        { error: 'Platform and username are required' },
        { status: 400 }
      );
    }

    // Validate the social media account
    const validationResult = await SocialMediaValidator.validateAccount(
      platform, 
      username, 
      accessToken
    );

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: validationResult.error,
        authUrl: validationResult.authUrl
      });
    }

    return NextResponse.json({
      success: true,
      account: validationResult.account
    });

  } catch (error) {
    console.error('Social media validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for generating OAuth URLs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required' },
        { status: 400 }
      );
    }

    let authUrl: string;

    switch (platform.toLowerCase()) {
      case 'instagram':
        authUrl = SocialMediaValidator.generateInstagramOAuthUrl();
        break;
      case 'facebook':
        authUrl = SocialMediaValidator.generateFacebookOAuthUrl();
        break;
      case 'youtube':
        authUrl = SocialMediaValidator.generateYouTubeOAuthUrl();
        break;
      default:
        return NextResponse.json(
          { error: `OAuth not implemented for ${platform}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      authUrl,
      platform
    });

  } catch (error) {
    console.error('OAuth URL generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 