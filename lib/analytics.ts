import type { InfluencerListItem } from '@/types/influencer';

export interface InfluencerAnalytics {
  totalReach: number;
  averageEngagementRate: number;
  topPlatform: string;
  audienceScore: number;
  categoryDiversity: number;
  verificationStatus: 'verified' | 'unverified';
  profileCompleteness: number;
}

export function calculateInfluencerAnalytics(influencer: InfluencerListItem): InfluencerAnalytics {
  const totalReach = influencer.totalFollowers;
  
  const averageEngagementRate = influencer.averageEngagement || 0;
  
  const topPlatform = influencer.socialPlatforms.length > 0
    ? influencer.socialPlatforms.reduce((prev, current) => 
        prev.followers > current.followers ? prev : current
      ).platform
    : 'None';

  const audienceScore = calculateAudienceScore(influencer);
  
  const categoryDiversity = influencer.categories.length;
  
  const verificationStatus = influencer.verified ? 'verified' : 'unverified';
  
  const profileCompleteness = calculateProfileCompleteness(influencer);

  return {
    totalReach,
    averageEngagementRate,
    topPlatform,
    audienceScore,
    categoryDiversity,
    verificationStatus,
    profileCompleteness
  };
}

function calculateAudienceScore(influencer: InfluencerListItem): number {
  let score = 0;
  
  if (influencer.totalFollowers > 0) score += 20;
  if (influencer.totalFollowers > 10000) score += 20;
  if (influencer.totalFollowers > 100000) score += 20;
  
  if (influencer.averageEngagement && influencer.averageEngagement > 2) score += 15;
  if (influencer.averageEngagement && influencer.averageEngagement > 5) score += 15;
  
  if (influencer.verified) score += 10;
  
  return Math.min(score, 100);
}

function calculateProfileCompleteness(influencer: InfluencerListItem): number {
  let completeness = 0;
  const totalFields = 8;
  
  if (influencer.name) completeness++;
  if (influencer.bio) completeness++;
  if (influencer.image) completeness++;
  if (influencer.location) completeness++;
  if (influencer.categories.length > 0) completeness++;
  if (influencer.socialPlatforms.length > 0) completeness++;
  if (influencer.verified) completeness++;
  if (influencer.profileComplete) completeness++;
  
  return Math.round((completeness / totalFields) * 100);
}

export function getInfluencerTier(followerCount: number): 'nano' | 'micro' | 'macro' | 'mega' {
  if (followerCount < 1000) return 'nano';
  if (followerCount < 100000) return 'micro';
  if (followerCount < 1000000) return 'macro';
  return 'mega';
}

export function getEngagementLevel(engagementRate: number): 'low' | 'average' | 'high' | 'excellent' {
  if (engagementRate < 1) return 'low';
  if (engagementRate < 3) return 'average';
  if (engagementRate < 6) return 'high';
  return 'excellent';
}

export function sortInfluencersByAnalytics(
  influencers: InfluencerListItem[],
  metric: 'audienceScore' | 'profileCompleteness' | 'engagement' | 'reach'
): InfluencerListItem[] {
  return [...influencers].sort((a, b) => {
    switch (metric) {
      case 'audienceScore':
        return calculateAudienceScore(b) - calculateAudienceScore(a);
      case 'profileCompleteness':
        return calculateProfileCompleteness(b) - calculateProfileCompleteness(a);
      case 'engagement':
        return (b.averageEngagement || 0) - (a.averageEngagement || 0);
      case 'reach':
        return b.totalFollowers - a.totalFollowers;
      default:
        return 0;
    }
  });
} 