'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Play,
  Instagram,
  Youtube,
  Twitter,
  Linkedin
} from 'lucide-react';

interface PlatformData {
  platform: string;
  username: string;
  followers: number;
  url?: string;
  profileData?: {
    posts?: number;
    avgLikes?: number;
    avgComments?: number;
    avgShares?: number;
    avgViews?: number;
    engagementRate?: number;
    videoViews?: number;
    subscribers?: number;
    uploads?: number;
    watchTime?: number;
  };
}

interface PlatformAnalyticsProps {
  platformData: PlatformData;
  averageEngagement?: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-5 w-5" />;
    case 'youtube':
      return <Youtube className="h-5 w-5" />;
    case 'twitter':
      return <Twitter className="h-5 w-5" />;
    case 'linkedin':
      return <Linkedin className="h-5 w-5" />;
    default:
      return <Users className="h-5 w-5" />;
  }
};

const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'from-purple-500 to-pink-500';
    case 'youtube':
      return 'from-red-500 to-red-600';
    case 'twitter':
      return 'from-blue-400 to-blue-500';
    case 'linkedin':
      return 'from-blue-600 to-blue-700';
    case 'tiktok':
      return 'from-black to-gray-800';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export function PlatformAnalytics({ platformData, averageEngagement }: PlatformAnalyticsProps) {
  const { platform, username, followers, profileData } = platformData;
  const platformLower = platform.toLowerCase();

  const renderInstagramAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Followers</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(followers)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold">
            {profileData?.engagementRate?.toFixed(1) || averageEngagement?.toFixed(1) || 'N/A'}%
          </p>
        </div>
      </div>

      {profileData && (
        <>
          {profileData.posts && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Total Posts</span>
              <p className="text-lg font-semibold">{formatNumber(profileData.posts)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {profileData.avgLikes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Avg. Likes</span>
                </div>
                <p className="font-semibold">{formatNumber(profileData.avgLikes)}</p>
              </div>
            )}

            {profileData.avgComments && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Avg. Comments</span>
                </div>
                <p className="font-semibold">{formatNumber(profileData.avgComments)}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderYouTubeAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Subscribers</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(followers)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Views</span>
          </div>
          <p className="text-2xl font-bold">
            {profileData?.videoViews ? formatNumber(profileData.videoViews) : 'N/A'}
          </p>
        </div>
      </div>

      {profileData && (
        <>
          {profileData.uploads && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Total Videos</span>
              <p className="text-lg font-semibold">{formatNumber(profileData.uploads)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {profileData.avgViews && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Avg. Views</span>
                </div>
                <p className="font-semibold">{formatNumber(profileData.avgViews)}</p>
              </div>
            )}

            {profileData.watchTime && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Watch Time</span>
                </div>
                <p className="font-semibold">{formatDuration(profileData.watchTime)}</p>
              </div>
            )}
          </div>

          {profileData.engagementRate && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Engagement Rate</span>
              <div className="flex items-center gap-2">
                <Progress value={profileData.engagementRate} className="flex-1" />
                <span className="text-sm font-semibold">{profileData.engagementRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderTikTokAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Followers</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(followers)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Avg. Likes</span>
          </div>
          <p className="text-2xl font-bold">
            {profileData?.avgLikes ? formatNumber(profileData.avgLikes) : 'N/A'}
          </p>
        </div>
      </div>

      {profileData && (
        <>
          {profileData.posts && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Total Videos</span>
              <p className="text-lg font-semibold">{formatNumber(profileData.posts)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {profileData.avgViews && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Avg. Views</span>
                </div>
                <p className="font-semibold">{formatNumber(profileData.avgViews)}</p>
              </div>
            )}

            {profileData.avgShares && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Share className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Avg. Shares</span>
                </div>
                <p className="font-semibold">{formatNumber(profileData.avgShares)}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderTwitterAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Followers</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(followers)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold">
            {profileData?.engagementRate?.toFixed(1) || averageEngagement?.toFixed(1) || 'N/A'}%
          </p>
        </div>
      </div>

      {profileData && (
        <div className="grid grid-cols-2 gap-4">
          {profileData.avgLikes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">Avg. Likes</span>
              </div>
              <p className="font-semibold">{formatNumber(profileData.avgLikes)}</p>
            </div>
          )}

          {profileData.avgShares && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Share className="h-4 w-4 text-green-500" />
                <span className="text-sm">Avg. Retweets</span>
              </div>
              <p className="font-semibold">{formatNumber(profileData.avgShares)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderLinkedInAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Connections</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(followers)}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold">
            {profileData?.engagementRate?.toFixed(1) || averageEngagement?.toFixed(1) || 'N/A'}%
          </p>
        </div>
      </div>

      {profileData && (
        <div className="grid grid-cols-2 gap-4">
          {profileData.avgLikes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Avg. Reactions</span>
              </div>
              <p className="font-semibold">{formatNumber(profileData.avgLikes)}</p>
            </div>
          )}

          {profileData.avgComments && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Avg. Comments</span>
              </div>
              <p className="font-semibold">{formatNumber(profileData.avgComments)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    switch (platformLower) {
      case 'instagram':
        return renderInstagramAnalytics();
      case 'youtube':
        return renderYouTubeAnalytics();
      case 'tiktok':
        return renderTikTokAnalytics();
      case 'twitter':
        return renderTwitterAnalytics();
      case 'linkedin':
        return renderLinkedInAnalytics();
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Followers</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(followers)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                <p className="text-2xl font-bold">
                  {averageEngagement?.toFixed(1) || 'N/A'}%
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlatformColor(platform)}`}>
            <div className="text-white">
              {getPlatformIcon(platform)}
            </div>
          </div>
          <div>
            <p className="font-semibold capitalize">{platform}</p>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {renderAnalytics()}
      </CardContent>
    </Card>
  );
} 