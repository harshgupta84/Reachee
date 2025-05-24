'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Eye, 
  Heart, 
  DollarSign, 
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle,
  Camera,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  RefreshCw,
  MessageSquare,
  Share2,
  Instagram,
  Globe,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnalyticsEngine } from '@/lib/analytics-engine';

interface AnalyticsDashboardProps {
  profileData: any;
  onNavigateToProfile?: () => void;
}

const COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  accent: '#ffc658',
  warning: '#ff7300',
  danger: '#ff4444',
  success: '#00C851'
};

const PLATFORM_COLORS = {
  Instagram: '#E4405F',
  YouTube: '#FF0000',
  LinkedIn: '#0077B5',
  Twitter: '#1DA1F2',
  Facebook: '#4267B2'
};

const PLATFORM_ICONS = {
  Instagram: '📸',
  YouTube: '▶️',
  LinkedIn: '💼',
  Twitter: '🐦',
  Facebook: '👥'
};

export default function AnalyticsDashboard({ profileData, onNavigateToProfile }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (profileData?.influencerProfile) {
      const connectedPlatforms = profileData.influencerProfile.socialPlatforms || [];
      
      const analyticsProfile = {
        socialPlatforms: connectedPlatforms.map((platform: any) => {
          let followers = platform.followers || 0;
          
          if (platform.platform === 'YouTube' && platform.profileData?.subscriberCount) {
            followers = platform.profileData.subscriberCount;
          }
          
          return {
            platform: platform.platform,
            followers,
            engagement: AnalyticsEngine.getPlatformEngagementRate ? 
              AnalyticsEngine.getPlatformEngagementRate(platform) : 3.5,
            posts: platform.profileData?.mediaCount || 
                   platform.profileData?.videoCount || 50,
            avgLikes: platform.profileData?.avgLikes || 
                     Math.round(followers * 0.035),
            avgComments: platform.profileData?.avgComments || 
                        Math.round(followers * 0.008),
            avgShares: platform.profileData?.avgShares || 
                      Math.round(followers * 0.002)
          };
        }),
        categories: profileData.influencerProfile.categories || [],
        location: profileData.influencerProfile.location || '',
        minimumRate: 100
      };

      const result = AnalyticsEngine.calculateComprehensiveAnalytics(analyticsProfile);
      setAnalytics(result);
      
      setTimeSeriesData(AnalyticsEngine.generateTimeSeriesData(30, connectedPlatforms));
      setPlatformData(AnalyticsEngine.generatePlatformData(connectedPlatforms));
      setLastUpdated(new Date());
    }
  }, [profileData]);

  // Sync all connected platforms data
  const handleSyncData = async () => {
    if (!profileData?.influencerProfile?.socialPlatforms || isSyncing) return;
    
    setIsSyncing(true);
    toast.info('Syncing social media data...');
    
    try {
      // Simulate API calls to refresh each platform's data
      const connectedPlatforms = profileData.influencerProfile.socialPlatforms;
      
      // In a real implementation, this would call your social media refresh APIs
      await Promise.all(
        connectedPlatforms.map(async (platform: any) => {
          if (platform.accessToken) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Here you would call your actual refresh API endpoint
            // await fetch(`/api/social/refresh/${platform.id}`, { method: 'POST' });
          }
        })
      );
      
      // Update the timestamp
      setLastUpdated(new Date());
      
      // Refresh analytics data
      const analyticsProfile = {
        socialPlatforms: connectedPlatforms.map((platform: any) => {
          let followers = platform.followers || 0;
          
          if (platform.platform === 'YouTube' && platform.profileData?.subscriberCount) {
            followers = platform.profileData.subscriberCount;
          }
          
          return {
            platform: platform.platform,
            followers,
            engagement: AnalyticsEngine.getPlatformEngagementRate ? 
              AnalyticsEngine.getPlatformEngagementRate(platform) : 3.5,
            posts: platform.profileData?.mediaCount || 
                   platform.profileData?.videoCount || 50,
            avgLikes: platform.profileData?.avgLikes || 
                     Math.round(followers * 0.035),
            avgComments: platform.profileData?.avgComments || 
                        Math.round(followers * 0.008),
            avgShares: platform.profileData?.avgShares || 
                      Math.round(followers * 0.002)
          };
        }),
        categories: profileData.influencerProfile.categories || [],
        location: profileData.influencerProfile.location || '',
        minimumRate: 100
      };

      const result = AnalyticsEngine.calculateComprehensiveAnalytics(analyticsProfile);
      setAnalytics(result);
      
      setTimeSeriesData(AnalyticsEngine.generateTimeSeriesData(30, connectedPlatforms));
      setPlatformData(AnalyticsEngine.generatePlatformData(connectedPlatforms));
      
      toast.success('Social media data synced successfully!');
      
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync social media data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Check if no social platforms are connected
  const connectedPlatforms = profileData?.influencerProfile?.socialPlatforms || [];
  const hasConnectedPlatforms = connectedPlatforms.length > 0;

  if (!hasConnectedPlatforms) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="py-12">
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">No Analytics Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Connect your social media accounts to unlock powerful analytics, ROI calculations, 
                  and AI-powered insights about your influencer performance.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-lg mx-auto pt-6">
                <div className="flex flex-col items-center gap-2 p-4 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📸</span>
                  </div>
                  <span className="text-sm font-medium text-pink-800">Instagram</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Youtube className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-red-800">YouTube</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">Twitter</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-4 bg-blue-600 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">Facebook</span>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={onNavigateToProfile}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Connect Social Media
                </Button>
              </div>

              <div className="pt-4 border-t max-w-md mx-auto">
                <h4 className="font-medium text-gray-900 mb-3">Once connected, you'll unlock:</h4>
                <div className="grid gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>ROI calculations and investment recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Growth predictions and engagement analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span>Performance insights and optimization tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-600" />
                    <span>Campaign forecasts and market analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getROIColor = (recommendation: string) => {
    switch (recommendation) {
      case 'PREMIUM': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'HIGH': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DOWN': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'STABLE': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real Platform Insights - NEW SECTION */}
      <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-violet-50 border-emerald-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Connected Platforms Overview
                </span>
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span className="text-gray-700">Real-time data from your connected social media accounts</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                    <span className="font-medium">Updated {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <Button
              onClick={handleSyncData}
              disabled={isSyncing}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 hover:text-emerald-800 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedPlatforms.map((platform: any) => {
              const Icon = platform.platform === 'Instagram' ? Camera :
                          platform.platform === 'YouTube' ? Youtube :
                          platform.platform === 'Twitter' ? Twitter :
                          platform.platform === 'Facebook' ? Facebook :
                          platform.platform === 'LinkedIn' ? Linkedin :
                          Users;
              
              const platformColor = PLATFORM_COLORS[platform.platform as keyof typeof PLATFORM_COLORS] || '#6B7280';
              const platformEmoji = PLATFORM_ICONS[platform.platform as keyof typeof PLATFORM_ICONS] || '📱';
              const engagementRate = AnalyticsEngine.getPlatformEngagementRate(platform);
              
              let followers = platform.followers || 0;
              if (platform.platform === 'YouTube' && platform.profileData?.subscriberCount) {
                followers = platform.profileData.subscriberCount;
              }
              
              const followerLabel = platform.platform === 'YouTube' ? 'subscribers' : 'followers';
              
              return (
                <div key={platform.id} className="group flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                    style={{ 
                      backgroundColor: platformColor,
                      boxShadow: `0 8px 25px ${platformColor}20`
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900">{platform.platform}</span>
                      <span className="text-xl">{platformEmoji}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">@{platform.username}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 font-bold text-gray-800">
                        <Users className="h-4 w-4" style={{ color: platformColor }} />
                        <span style={{ color: platformColor }}>{followers.toLocaleString()}</span>
                        <span className="text-gray-600">{followerLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-pink-600">{engagementRate}%</span>
                      </span>
                      {platform.accessToken && (
                        <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 font-semibold shadow-sm">
                          <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                          Live Data
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Platform Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 via-emerald-100 to-green-100 rounded-xl border border-emerald-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl font-bold text-emerald-700 mb-1">
                {connectedPlatforms.reduce((sum: number, p: any) => {
                  let followers = p.followers || 0;
                  if (p.platform === 'YouTube' && p.profileData?.subscriberCount) {
                    followers = p.profileData.subscriberCount;
                  }
                  return sum + followers;
                }, 0).toLocaleString()}
              </div>
              <div className="text-sm text-emerald-800 font-bold uppercase tracking-wide">Total Reach</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl font-bold text-blue-700 mb-1">
                {connectedPlatforms.length}
              </div>
              <div className="text-sm text-blue-800 font-bold uppercase tracking-wide">Platforms</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl font-bold text-purple-700 mb-1">
                {connectedPlatforms.length > 0 ? 
                  Math.round(connectedPlatforms.reduce((sum: number, p: any) => 
                    sum + AnalyticsEngine.getPlatformEngagementRate(p), 0) / connectedPlatforms.length * 10) / 10 : 0}%
              </div>
              <div className="text-sm text-purple-800 font-bold uppercase tracking-wide">Avg Engagement</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 rounded-xl border border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl font-bold text-orange-700 mb-1">
                {connectedPlatforms.filter((p: any) => p.accessToken).length}
              </div>
              <div className="text-sm text-orange-800 font-bold uppercase tracking-wide">Verified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Expected ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{analytics.roi.expectedROI}%</div>
            <Badge className={getROIColor(analytics.roi.investmentRecommendation)}>
              {analytics.roi.investmentRecommendation}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Engagement Score</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{analytics.engagement.overallScore}%</div>
            <p className="text-xs text-green-700 font-medium">
              Quality: {analytics.engagement.audienceQuality.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              +{analytics.growth.followerGrowthRate}%
            </div>
            <p className="text-xs text-purple-700 font-medium">
              {analytics.growth.growthTrend}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Brand Value</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {isFinite(analytics.roi.brandValueScore) ? analytics.roi.brandValueScore.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-orange-700 font-medium">
              Market Rank: {analytics.market.competitorRanking}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reachee Score Section */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-indigo-900">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            Reachee Score
            <Badge variant="outline" className="bg-white border-indigo-300 text-indigo-700 font-semibold">
              Platform KPI
            </Badge>
          </CardTitle>
          <CardDescription className="text-base text-indigo-700">
            Your comprehensive influencer performance rating based on reach, engagement, growth, and market value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Score Display */}
            <div className="md:col-span-1 text-center p-6 bg-white/90 rounded-xl border border-indigo-200 shadow-sm">
              <div className="text-6xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {analytics.reacheeScore.overall}
              </div>
              <div className="text-lg font-semibold text-indigo-800 mb-1">
                {analytics.reacheeScore.rating}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Top {100 - analytics.reacheeScore.percentileRank}% of influencers
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="md:col-span-2 space-y-3">
              {Object.entries(analytics.reacheeScore.breakdown).map(([key, value]) => {
                const numValue = value as number;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-semibold capitalize text-gray-800">
                      {key === 'marketValue' ? 'Market' : key}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                          numValue >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          numValue >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          numValue >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${numValue}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm font-bold text-right text-gray-800">
                      {numValue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {analytics.reacheeScore.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm text-green-800 flex items-start gap-2 font-medium">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Growth Opportunities
              </h4>
              <ul className="space-y-2">
                {analytics.reacheeScore.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start gap-2 font-medium">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Chart */}
      {/* Removed: Performance Trends chart because it shows mock data instead of real historical analytics data */}
      {/* Will only be shown when actual historical data tracking is implemented */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Platform Performance
            </CardTitle>
            <CardDescription>Engagement rates across platforms - Real data from connected accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {platformData.map((platform: any) => {
                const realPlatform = connectedPlatforms.find((p: any) => p.platform === platform.platform);
                const isVerified = realPlatform?.accessToken;
                const followerLabel = platform.platform === 'YouTube' ? 'subscribers' : 'followers';
                
                return (
                  <div key={platform.platform} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: PLATFORM_COLORS[platform.platform as keyof typeof PLATFORM_COLORS] }}
                      />
                      <span className="text-sm font-medium">{platform.platform}</span>
                      <span className="text-sm">
                        {PLATFORM_ICONS[platform.platform as keyof typeof PLATFORM_ICONS] || '📱'}
                      </span>
                      {isVerified ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Live Data
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-xs">
                          Estimated
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-pink-600">{platform.engagement}%</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {platform.followers.toLocaleString()} {followerLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {connectedPlatforms.filter((p: any) => !p.accessToken).length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Connect platforms with OAuth for real-time engagement data and more accurate analytics.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROI Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              ROI Analysis
            </CardTitle>
            <CardDescription>Investment return breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cost per Acquisition</span>
                <span className="font-bold">${analytics.roi.costPerAcquisition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reach Value</span>
                <span className="font-bold">{analytics.roi.reachValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Engagement Value</span>
                <span className="font-bold">${analytics.roi.engagementValue}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Investment Recommendation</h4>
              <Badge className={getROIColor(analytics.roi.investmentRecommendation) + ' text-xs px-3 py-1'}>
                {analytics.roi.investmentRecommendation} PRIORITY
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Radar Chart */}
      {/* Removed: Performance Matrix chart because it shows calculated/simulated data using Math.random() instead of real performance tracking */}
      {/* These metrics would need actual campaign tracking, content analysis, and brand safety monitoring to be meaningful */}

      {/* Predictions & Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Campaign Predictions
            </CardTitle>
            <CardDescription>AI-powered campaign performance forecasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expected Reach</span>
                <span className="font-bold">{analytics.predictions.expectedCampaignReach.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Predicted Engagement</span>
                <span className="font-bold">{analytics.predictions.predictedEngagementRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conversion Probability</span>
                <span className="font-bold">{analytics.predictions.conversionProbability}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Brand Lift</span>
                <span className="font-bold">{analytics.predictions.brandLiftExpectation}%</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Assessment</span>
                <div className="flex items-center gap-2">
                  {analytics.predictions.riskAssessment === 'LOW' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {analytics.predictions.riskAssessment === 'MEDIUM' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  {analytics.predictions.riskAssessment === 'HIGH' && <Shield className="h-4 w-4 text-red-600" />}
                  <span className={`font-medium ${getRiskColor(analytics.predictions.riskAssessment)}`}>
                    {analytics.predictions.riskAssessment}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Growth Projections
            </CardTitle>
            <CardDescription>Follower growth predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={[
                  { period: 'Current', followers: platformData.reduce((sum, p) => sum + p.followers, 0) },
                  { period: '30 days', followers: analytics.growth.projected30Day },
                  { period: '90 days', followers: analytics.growth.projected90Day },
                  { period: '1 year', followers: analytics.growth.projected1Year }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Growth Trend:</strong> {analytics.growth.growthTrend.toLowerCase()} growth pattern detected with {analytics.growth.followerGrowthRate}% monthly rate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Optimization Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations for maximum impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Best Performing Content</h4>
              <div className="space-y-2">
                {analytics.engagement.bestPerformingContent.map((content: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{content}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Optimal Posting Times</h4>
              <div className="space-y-2">
                {analytics.engagement.optimalPostingTimes.slice(0, 3).map((item: any) => (
                  <div key={item.platform} className="text-sm">
                    <span className="font-medium">{item.platform}:</span> {item.times.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 