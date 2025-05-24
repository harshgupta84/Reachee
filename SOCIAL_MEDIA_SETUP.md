# Social Media API Setup Guide

This guide will help you set up real Instagram, Facebook, and YouTube API integration for the Reachee platform.

## 🚀 Features Implemented

- ✅ **Instagram Basic Display API** - Real profile validation and follower data
- ✅ **Facebook Graph API** - Page and profile information
- ✅ **YouTube Data API v3** - Channel information, subscriber count, and video statistics
- ✅ **LinkedIn Profile API** - Professional profile and connection data
- ✅ **OAuth 2.0 Flow** - Secure authentication for all four platforms
- ✅ **Manual Entry Fallback** - For platforms without OAuth (Twitter)
- ✅ **Real-time Validation** - Verify accounts exist and get actual follower counts
- ✅ **Access Token Management** - Store and refresh tokens for data updates

## 📋 Prerequisites

1. Facebook Developer Account (for Instagram and Facebook)
2. Google Cloud Console Account (for YouTube)
3. LinkedIn Developer Account (for LinkedIn)
4. Twitter Developer Account (for Twitter/X)
5. Node.js and npm installed
6. PostgreSQL database

## 🔧 Setup Instructions

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" → "Consumer" → "Next"
3. Fill in your app details:
   - **App Name**: "Reachee Social Connect"
   - **Contact Email**: Your email
   - **App Purpose**: Business

### 2. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### 3. Configure OAuth Consent Screen (Google)

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - **App name**: "Reachee"
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes: `https://www.googleapis.com/auth/youtube.readonly`
5. Add test users (your Google account)

### 4. Create OAuth 2.0 Credentials (Google)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add redirect URIs:
   - `http://localhost:3000/api/auth/youtube/callback`
   - `https://yourdomain.com/api/auth/youtube/callback` (production)
5. Note down your **Client ID** and **Client Secret**

### 5. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in your app details:
   - **App Name**: "Reachee Social Connect"
   - **LinkedIn Page**: Your company page (or create one)
   - **Privacy Policy URL**: Your privacy policy
   - **App Logo**: Upload your app logo
4. Go to "Auth" tab
5. Add redirect URIs:
   - `http://localhost:3000/api/auth/linkedin/callback`
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)
6. Request access to these products:
   - **Sign In with LinkedIn** (for basic profile access)
   - **Share on LinkedIn** (for connection data)
7. Note down your **Client ID** and **Client Secret**

### 6. Create Twitter Developer App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for a developer account (if you don't have one)
3. Create a new project and app:
   - **Project Name**: "Reachee Social Connect"
   - **App Name**: "Reachee"
   - **App Description**: "Social media influencer analytics platform"
4. Go to your app settings → "Keys and tokens"
5. **Important:** Twitter API v2 uses OAuth 2.0 with PKCE (not basic auth)
6. Set up OAuth 2.0 settings:
   - **App permissions**: Read (for user profile and tweets)
   - **Type of App**: Web App
   - **Callback URI**: `http://localhost:3000/api/auth/twitter/callback`
   - **Website URL**: Your app's website
   - **Enable OAuth 2.0**: Make sure this is enabled
7. Note down your **Client ID** (you don't need Client Secret for PKCE flow)
8. **Optional:** Generate Bearer Token for app-only requests (not needed for user OAuth)

**Note:** Twitter API v2 has two authentication methods:
- **Bearer Token**: For app-only requests (public data)
- **OAuth 2.0 + PKCE**: For user-context requests (what we use)

### 7. Add Products to Your Facebook App

#### Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Go to "Instagram Basic Display" → "Basic Display"
4. Add Instagram Test Users (your Instagram account)
5. Configure redirect URIs:
   - `http://localhost:3000/api/auth/instagram/callback`
   - `https://yourdomain.com/api/auth/instagram/callback` (production)

#### Facebook Login
1. Click "Add Product" → "Facebook Login" → "Set Up"
2. Choose "Web" platform
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback`
   - `https://yourdomain.com/api/auth/facebook/callback` (production)

### 8. Configure App Settings

1. Go to "Settings" → "Basic"
2. Note down your **App ID** and **App Secret**
3. Add your domain to "App Domains"
4. Set "Privacy Policy URL" and "Terms of Service URL"

### 9. Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Facebook App Credentials
FACEBOOK_APP_ID="your_app_id_here"
FACEBOOK_APP_SECRET="your_app_secret_here"
FACEBOOK_REDIRECT_URI="http://localhost:3000/api/auth/facebook/callback"

# Instagram (uses same Facebook app)
INSTAGRAM_REDIRECT_URI="http://localhost:3000/api/auth/instagram/callback"

# Google/YouTube Credentials
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
YOUTUBE_REDIRECT_URI="http://localhost:3000/api/auth/youtube/callback"

# LinkedIn Credentials
LINKEDIN_CLIENT_ID="your_linkedin_client_id_here"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret_here"
LINKEDIN_REDIRECT_URI="http://localhost:3000/api/auth/linkedin/callback"

# Twitter/X Credentials
TWITTER_CLIENT_ID="your_twitter_client_id_here"
# Note: Twitter API v2 with PKCE doesn't require client secret
TWITTER_REDIRECT_URI="http://localhost:3000/api/auth/twitter/callback"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 9. Database Schema Updates

The Prisma schema already includes the necessary fields. Run:

```bash
npx prisma db push
```

## 🎯 How It Works

### Instagram Integration
1. **OAuth Flow**: User clicks "Connect with OAuth" → Redirected to Instagram
2. **Authorization**: User grants permission → Instagram returns authorization code
3. **Token Exchange**: Our backend exchanges code for access token
4. **Profile Fetch**: We fetch user profile, media count, and account type
5. **Data Storage**: Store validated data in database with access token

### Facebook Integration
1. **OAuth Flow**: Similar to Instagram but uses Facebook Graph API
2. **Page Detection**: Automatically detects if user has Facebook Pages (for businesses)
3. **Follower Count**: Gets real follower count for Facebook Pages
4. **Profile Data**: Stores page info, category, and business details

### YouTube Integration
1. **OAuth Flow**: Uses Google OAuth 2.0 with YouTube Data API v3 scope
2. **Channel Detection**: Automatically finds user's YouTube channel
3. **Subscriber Count**: Gets real subscriber count and video statistics
4. **Channel Data**: Stores channel info, custom URL, video count, view count, and thumbnails

### Twitter Integration
1. **OAuth Flow**: Uses Twitter API v2 with OAuth 2.0 authorization
2. **User Profile**: Gets real follower count, tweet count, and profile information
3. **Engagement Data**: Calculates engagement rates based on follower tiers
4. **Verification Status**: Shows verified badge status and account type

### LinkedIn Integration
1. **OAuth Flow**: Uses LinkedIn OAuth 2.0 with professional profile scope
2. **Profile Data**: Gets professional information and connection count
3. **Company Pages**: Detects and connects company pages for businesses
4. **Network Analysis**: Analyzes professional network and industry connections

### Manual Entry Fallback
- For platforms without OAuth configured
- Basic username validation
- Manual follower count entry
- Marked as "Manual" vs "Verified"

## 🛡️ Security Features

- **Access Token Encryption**: Tokens stored securely in database
- **Scope Limitation**: Only requests necessary permissions
- **Token Refresh**: Automatic token refresh for long-lived access
- **Error Handling**: Comprehensive error handling and user feedback

## 🎨 UI/UX Features

- **OAuth Badges**: Green shield icons for platforms with OAuth
- **Verification Status**: "Verified" vs "Manual" badges
- **Real-time Feedback**: Loading states and error messages
- **Platform-specific Styling**: Brand colors and icons for each platform

## 📱 Supported Platforms

| Platform | Status | OAuth | Real Data | Notes |
|----------|--------|-------|-----------|-------|
| Instagram | ✅ Ready | ✅ Yes | ✅ Yes | Basic Display API |
| Facebook | ✅ Ready | ✅ Yes | ✅ Yes | Graph API for Pages |
| YouTube | ✅ Ready | ✅ Yes | ✅ Yes | Data API v3 for Channels |
| Twitter | ✅ Ready | ✅ Yes | ✅ Yes | OAuth 2.0 authorization |
| LinkedIn | ✅ Ready | ✅ Yes | ✅ Yes | Professional profile and connection data |

## 🚧 Testing

### Test Instagram Connection
1. Start development server: `npm run dev`
2. Go to `/dashboard` → Profile tab
3. Click "Add Platform" → Instagram
4. Click "Connect with OAuth"
5. Should redirect to Instagram authorization
6. After approval, should return with verified account

### Test Facebook Connection
1. Same process as Instagram
2. If you have Facebook Pages, they'll be detected automatically
3. Personal profiles also supported with limited data

### Test YouTube Connection
1. Same process as other platforms
2. Click "Add Platform" → YouTube
3. Click "Connect with OAuth"
4. Should redirect to Google OAuth with YouTube scope
5. After approval, should return with channel data including subscriber count

## 🐛 Troubleshooting

### Common Issues

1. **"App Not Approved"**: Your app needs to be reviewed by Facebook for production
2. **"Invalid Redirect URI"**: Ensure redirect URIs match exactly in app settings
3. **"Access Token Invalid"**: Check if tokens have expired, implement refresh logic
4. **"Username Not Found"**: Instagram Basic Display API only works with test users initially
5. **"YouTube API Quota Exceeded"**: Check your Google Cloud Console quota limits
6. **"OAuth Consent Required"**: Make sure OAuth consent screen is configured

### Development vs Production

- **Development**: Use test users and development app credentials
- **Production**: Submit apps for review, add real users, use production credentials

## 🔮 Future Enhancements

- **Automatic data refresh** with cron jobs
- **Analytics integration** with real engagement metrics
- **Webhook support** for real-time updates
- **Advanced YouTube metrics** (watch time, demographics)
- **TikTok API integration** (when available)
- **Advanced LinkedIn company analytics**

## 📞 Support

If you need help setting up the APIs:
1. Check platform-specific developer documentation
2. Test with test accounts first
3. Ensure all redirect URIs are configured correctly
4. Verify environment variables are set properly

The system is designed to gracefully handle missing API credentials and will fall back to manual entry mode if OAuth is not configured. 