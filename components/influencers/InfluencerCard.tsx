'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, TrendingUp, CheckCircle, Instagram, Youtube, MessageSquare } from 'lucide-react';
import { PlatformAnalytics } from './PlatformAnalytics';
import type { InfluencerListItem } from '@/types/influencer';

interface InfluencerCardProps {
  influencer: InfluencerListItem;
  onViewProfile?: (influencer: InfluencerListItem) => void;
  onContact?: (influencer: InfluencerListItem) => void;
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

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'youtube':
      return <Youtube className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

export function InfluencerCard({ 
  influencer, 
  onViewProfile, 
  onContact 
}: InfluencerCardProps) {
  const hasPlatforms = influencer.socialPlatforms.length > 0;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={influencer.image || undefined} 
              alt={influencer.name || 'Influencer'} 
            />
            <AvatarFallback>
              {influencer.name?.slice(0, 2).toUpperCase() || 'IN'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {influencer.name || 'Anonymous'}
              </h3>
              {influencer.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            
            {influencer.location && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{influencer.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{formatNumber(influencer.totalFollowers)}</span>
              </div>
              
              {influencer.averageEngagement && (
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{influencer.averageEngagement.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {influencer.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {influencer.bio}
          </p>
        )}

        {influencer.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {influencer.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {influencer.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{influencer.categories.length - 3}
              </Badge>
            )}
          </div>
        )}

        {hasPlatforms && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Platform Analytics</h4>
            <Tabs defaultValue={influencer.socialPlatforms[0]?.platform.toLowerCase()} className="w-full">
              <TabsList className="grid w-full grid-cols-auto gap-1 p-1" style={{
                gridTemplateColumns: `repeat(${Math.min(influencer.socialPlatforms.length, 3)}, 1fr)`
              }}>
                {influencer.socialPlatforms.slice(0, 3).map((platform) => (
                  <TabsTrigger 
                    key={platform.platform} 
                    value={platform.platform.toLowerCase()}
                    className="text-xs px-2 py-1"
                  >
                    {platform.platform}
                  </TabsTrigger>
                ))}
                {influencer.socialPlatforms.length > 3 && (
                  <TabsTrigger value="more" className="text-xs px-2 py-1">
                    +{influencer.socialPlatforms.length - 3}
                  </TabsTrigger>
                )}
              </TabsList>
              
              {influencer.socialPlatforms.slice(0, 3).map((platform) => (
                <TabsContent 
                  key={platform.platform} 
                  value={platform.platform.toLowerCase()}
                  className="mt-3"
                >
                  <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{platform.platform}</span>
                      <span className="text-sm text-muted-foreground">@{platform.username}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Followers</span>
                        <p className="font-semibold">{formatNumber(platform.followers)}</p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Engagement</span>
                        <p className="font-semibold">
                          {influencer.averageEngagement?.toFixed(1) || 'N/A'}%
                        </p>
                      </div>
                    </div>

                    {platform.platform.toLowerCase() === 'youtube' && (
                      <div className="pt-1">
                        <span className="text-xs text-muted-foreground">Subscribers</span>
                      </div>
                    )}

                    {platform.platform.toLowerCase() === 'instagram' && (
                      <div className="pt-1">
                        <span className="text-xs text-muted-foreground">Posts & Stories</span>
                      </div>
                    )}

                    {platform.platform.toLowerCase() === 'tiktok' && (
                      <div className="pt-1">
                        <span className="text-xs text-muted-foreground">Video Content</span>
                      </div>
                    )}

                    {platform.platform.toLowerCase() === 'twitter' && (
                      <div className="pt-1">
                        <span className="text-xs text-muted-foreground">Tweets & Replies</span>
                      </div>
                    )}

                    {platform.platform.toLowerCase() === 'linkedin' && (
                      <div className="pt-1">
                        <span className="text-xs text-muted-foreground">Professional Network</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
              
              {influencer.socialPlatforms.length > 3 && (
                <TabsContent value="more" className="mt-3">
                  <div className="space-y-2">
                    {influencer.socialPlatforms.slice(3).map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{platform.platform}</span>
                          <span className="text-muted-foreground text-xs">@{platform.username}</span>
                        </div>
                        <span className="font-semibold">{formatNumber(platform.followers)}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewProfile?.(influencer)}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onContact?.(influencer)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 