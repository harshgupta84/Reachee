'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlatformAnalytics } from '@/components/influencers/PlatformAnalytics';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  MessageSquare, 
  ArrowLeft,
  Calendar,
  Globe
} from 'lucide-react';
import type { InfluencerListItem } from '@/types/influencer';

export default function InfluencerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [influencer, setInfluencer] = useState<InfluencerListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/influencers/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch influencer details');
        }
        
        const data = await response.json();
        setInfluencer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInfluencer();
    }
  }, [params.id]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const handleViewAnalytics = () => {
    router.push('/dashboard?tab=analytics');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Influencer not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage 
                  src={influencer.image || undefined} 
                  alt={influencer.name || 'Influencer'} 
                />
                <AvatarFallback className="text-2xl">
                  {influencer.name?.slice(0, 2).toUpperCase() || 'IN'}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {influencer.name || 'Anonymous Influencer'}
                  </h1>
                  {influencer.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                {influencer.location && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{influencer.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(influencer.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {influencer.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {influencer.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(influencer.totalFollowers)}</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {influencer.averageEngagement?.toFixed(1) || 'N/A'}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Engagement</p>
                </div>
              </div>

              {influencer.categories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Influencer
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleViewAnalytics}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {influencer.socialPlatforms.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={influencer.socialPlatforms[0]?.platform.toLowerCase()} className="w-full">
                  <TabsList className="grid w-full gap-1 p-1" style={{
                    gridTemplateColumns: `repeat(${influencer.socialPlatforms.length}, 1fr)`
                  }}>
                    {influencer.socialPlatforms.map((platform) => (
                      <TabsTrigger 
                        key={platform.platform} 
                        value={platform.platform.toLowerCase()}
                        className="text-sm"
                      >
                        {platform.platform}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {influencer.socialPlatforms.map((platform) => (
                    <TabsContent 
                      key={platform.platform} 
                      value={platform.platform.toLowerCase()}
                      className="mt-6"
                    >
                      <PlatformAnalytics
                        platformData={{
                          platform: platform.platform,
                          username: platform.username,
                          followers: platform.followers,
                          profileData: {
                            engagementRate: influencer.averageEngagement || undefined,
                          }
                        }}
                        averageEngagement={influencer.averageEngagement || undefined}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Connected Platforms</h3>
                <p className="text-muted-foreground">
                  This influencer hasn't connected any social media platforms yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 