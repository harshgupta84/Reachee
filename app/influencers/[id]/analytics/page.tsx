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
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Target,
  Clock
} from 'lucide-react';
import type { InfluencerListItem } from '@/types/influencer';

export default function InfluencerAnalyticsPage() {
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

  const generateMockAnalytics = (influencer: InfluencerListItem) => {
    const baseEngagement = influencer.averageEngagement || 3.5;
    
    return {
      overview: {
        totalReach: influencer.totalFollowers,
        avgEngagement: baseEngagement,
        totalPosts: Math.floor(Math.random() * 500) + 100,
        avgLikes: Math.floor(influencer.totalFollowers * (baseEngagement / 100)),
        avgComments: Math.floor(influencer.totalFollowers * (baseEngagement / 100) * 0.1),
        avgShares: Math.floor(influencer.totalFollowers * (baseEngagement / 100) * 0.05),
      },
      growth: {
        followersGrowth: Math.floor(Math.random() * 10) + 2,
        engagementGrowth: Math.floor(Math.random() * 15) - 5,
        reachGrowth: Math.floor(Math.random() * 20) + 5,
      },
      audience: {
        topCountries: ['United States (45%)', 'Canada (15%)', 'United Kingdom (12%)', 'Australia (8%)', 'Germany (6%)'],
        ageGroups: ['18-24 (35%)', '25-34 (40%)', '35-44 (15%)', '45-54 (7%)', '55+ (3%)'],
        genderSplit: { male: 45, female: 52, other: 3 },
      },
      performance: {
        bestPostTime: '7:00 PM - 9:00 PM',
        bestPostDay: 'Wednesday',
        topHashtags: ['#lifestyle', '#fashion', '#beauty', '#travel', '#fitness'],
        avgViewDuration: '2m 30s',
      }
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
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

  const analytics = generateMockAnalytics(influencer);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage 
            src={influencer.image || undefined} 
            alt={influencer.name || 'Influencer'} 
          />
          <AvatarFallback className="text-lg">
            {influencer.name?.slice(0, 2).toUpperCase() || 'IN'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{influencer.name || 'Anonymous Influencer'} Analytics</h1>
          <p className="text-muted-foreground">Detailed performance insights and audience analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalReach)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics.growth.followersGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.avgEngagement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={analytics.growth.engagementGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {analytics.growth.engagementGrowth >= 0 ? '+' : ''}{analytics.growth.engagementGrowth}%
              </span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.avgLikes)}</div>
            <p className="text-xs text-muted-foreground">
              Per post average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {influencer.socialPlatforms.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{platform.platform}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(platform.followers)} followers
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(platform.followers / influencer.totalFollowers) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Engagement Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Likes</span>
                    </div>
                    <span className="font-medium">{formatNumber(analytics.overview.avgLikes)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>Comments</span>
                    </div>
                    <span className="font-medium">{formatNumber(analytics.overview.avgComments)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share className="h-4 w-4 text-green-500" />
                      <span>Shares</span>
                    </div>
                    <span className="font-medium">{formatNumber(analytics.overview.avgShares)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.audience.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{country}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.audience.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{group}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.audience.genderSplit.male}%</div>
                  <div className="text-sm text-muted-foreground">Male</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">{analytics.audience.genderSplit.female}%</div>
                  <div className="text-sm text-muted-foreground">Female</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{analytics.audience.genderSplit.other}%</div>
                  <div className="text-sm text-muted-foreground">Other</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Optimal Posting Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Best Time to Post</h4>
                  <p className="text-2xl font-bold text-primary">{analytics.performance.bestPostTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Day to Post</h4>
                  <p className="text-2xl font-bold text-primary">{analytics.performance.bestPostDay}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Avg View Duration</h4>
                  <p className="text-2xl font-bold text-primary">{analytics.performance.avgViewDuration}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold mb-3">Popular Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.performance.topHashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    +{analytics.growth.followersGrowth}%
                  </div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${analytics.growth.engagementGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.growth.engagementGrowth >= 0 ? '+' : ''}{analytics.growth.engagementGrowth}%
                  </div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reach Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    +{analytics.growth.reachGrowth}%
                  </div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 