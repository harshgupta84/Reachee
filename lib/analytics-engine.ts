// Advanced Analytics Engine for Social Media ROI and Performance Metrics

interface SocialPlatformData {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  avgLikes?: number;
  avgComments?: number;
  avgShares?: number;
}

interface InfluencerProfile {
  socialPlatforms: SocialPlatformData[];
  categories: string[];
  location: string;
  minimumRate: number;
}

interface AnalyticsResult {
  roi: ROIAnalysis;
  engagement: EngagementAnalysis;
  growth: GrowthAnalysis;
  market: MarketAnalysis;
  performance: PerformanceMetrics;
  predictions: PredictionMetrics;
  reacheeScore: ReacheeScore;
}

interface ROIAnalysis {
  expectedROI: number;
  costPerAcquisition: number;
  reachValue: number;
  engagementValue: number;
  brandValueScore: number;
  investmentRecommendation: 'LOW' | 'MEDIUM' | 'HIGH' | 'PREMIUM';
}

interface EngagementAnalysis {
  overallScore: number;
  platformBreakdown: { platform: string; score: number; trend: 'UP' | 'DOWN' | 'STABLE' }[];
  bestPerformingContent: string[];
  optimalPostingTimes: { platform: string; times: string[] }[];
  audienceQuality: number;
}

interface GrowthAnalysis {
  followerGrowthRate: number;
  engagementGrowthRate: number;
  projected30Day: number;
  projected90Day: number;
  projected1Year: number;
  growthTrend: 'EXPONENTIAL' | 'LINEAR' | 'DECLINING' | 'VOLATILE';
}

interface MarketAnalysis {
  competitorRanking: number;
  marketShare: number;
  nicheDominance: number;
  brandAffinityScore: number;
  crossPlatformSynergy: number;
}

interface PerformanceMetrics {
  reachEfficiency: number;
  contentQualityScore: number;
  audienceAlignment: number;
  brandSafety: number;
  viralPotential: number;
}

interface PredictionMetrics {
  expectedCampaignReach: number;
  predictedEngagementRate: number;
  conversionProbability: number;
  brandLiftExpectation: number;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface ReacheeScore {
  overall: number;
  rating: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' | 'ELITE';
  breakdown: {
    reach: number;
    engagement: number;
    growth: number;
    quality: number;
    reliability: number;
    marketValue: number;
  };
  strengths: string[];
  improvements: string[];
  percentileRank: number;
}

export class AnalyticsEngine {
  
  /**
   * Main analytics calculation function
   */
  static calculateComprehensiveAnalytics(profile: InfluencerProfile): AnalyticsResult {
    const roi = this.calculateROI(profile);
    const engagement = this.analyzeEngagement(profile);
    const growth = this.analyzeGrowth(profile);
    const market = this.analyzeMarket(profile);
    const performance = this.calculatePerformance(profile);
    const predictions = this.generatePredictions(profile);

    return {
      roi,
      engagement,
      growth,
      market,
      performance,
      predictions,
      reacheeScore: this.calculateReacheeScore(profile)
    };
  }

  /**
   * Advanced ROI Calculation Algorithm
   */
  private static calculateROI(profile: InfluencerProfile): ROIAnalysis {
    const totalFollowers = profile.socialPlatforms.reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length;
    
    // Platform value multipliers based on conversion rates
    const platformValues = {
      'Instagram': 1.2,
      'YouTube': 1.8,
      'TikTok': 1.1,
      'Twitter': 0.9,
      'Facebook': 1.0
    };

    // Calculate reach value
    const reachValue = profile.socialPlatforms.reduce((total, platform) => {
      const multiplier = platformValues[platform.platform as keyof typeof platformValues] || 1.0;
      return total + (platform.followers * multiplier * (platform.engagement / 100));
    }, 0);

    // Engagement value calculation
    const engagementValue = reachValue * (avgEngagement / 100) * 0.02; // $0.02 per engaged follower

    // Cost per acquisition estimation
    const costPerAcquisition = profile.minimumRate / ((totalFollowers * avgEngagement / 100) * 0.005); // 0.5% conversion rate

    // Expected ROI calculation (sophisticated algorithm)
    const baseROI = (engagementValue / profile.minimumRate) * 100;
    const qualityMultiplier = this.calculateQualityMultiplier(profile);
    const expectedROI = baseROI * qualityMultiplier;

    // Brand value score (0-100)
    const brandValueScore = Math.min(100, 
      (avgEngagement * 2) + 
      (Math.log10(totalFollowers) * 10) +
      (profile.socialPlatforms.length * 5) +
      this.getCategoryBonus(profile.categories)
    );

    // Investment recommendation
    let investmentRecommendation: ROIAnalysis['investmentRecommendation'];
    if (expectedROI > 400) investmentRecommendation = 'PREMIUM';
    else if (expectedROI > 250) investmentRecommendation = 'HIGH';
    else if (expectedROI > 150) investmentRecommendation = 'MEDIUM';
    else investmentRecommendation = 'LOW';

    return {
      expectedROI: Math.round(expectedROI * 10) / 10,
      costPerAcquisition: Math.round(costPerAcquisition * 100) / 100,
      reachValue: Math.round(reachValue),
      engagementValue: Math.round(engagementValue * 100) / 100,
      brandValueScore: Math.round(brandValueScore * 10) / 10,
      investmentRecommendation
    };
  }

  /**
   * Engagement Analysis Algorithm
   */
  private static analyzeEngagement(profile: InfluencerProfile): EngagementAnalysis {
    const platformBreakdown = profile.socialPlatforms.map(platform => {
      let score = platform.engagement;
      
      // Adjust score based on follower count (micro-influencers often have higher engagement)
      if (platform.followers < 10000) score *= 1.2;
      else if (platform.followers > 1000000) score *= 0.8;
      
      // Determine trend (mock algorithm - would use historical data)
      const trend = Math.random() > 0.5 ? 'UP' : Math.random() > 0.5 ? 'STABLE' : 'DOWN';
      
      return {
        platform: platform.platform,
        score: Math.round(score * 10) / 10,
        trend: trend as 'UP' | 'DOWN' | 'STABLE'
      };
    });

    const overallScore = platformBreakdown.reduce((sum, p) => sum + p.score, 0) / platformBreakdown.length;
    
    // Mock best performing content (would be based on actual data analysis)
    const bestPerformingContent = [
      'Behind-the-scenes content',
      'Tutorial videos',
      'Product showcases',
      'User-generated content',
      'Story content'
    ].slice(0, 3);

    // Optimal posting times (algorithm based on engagement patterns)
    const optimalPostingTimes = profile.socialPlatforms.map(platform => ({
      platform: platform.platform,
      times: this.calculateOptimalTimes(platform.platform)
    }));

    // Audience quality score
    const audienceQuality = Math.min(100, overallScore * 1.5 + (Math.random() * 20));

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      platformBreakdown,
      bestPerformingContent,
      optimalPostingTimes,
      audienceQuality: Math.round(audienceQuality * 10) / 10
    };
  }

  /**
   * Growth Analysis Algorithm
   */
  private static analyzeGrowth(profile: InfluencerProfile): GrowthAnalysis {
    const totalFollowers = profile.socialPlatforms.reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length;
    
    // Mock growth rates (would be calculated from historical data)
    const followerGrowthRate = (Math.random() * 10 + 2); // 2-12% monthly
    const engagementGrowthRate = (Math.random() * 8 + 1); // 1-9% monthly
    
    // Projections
    const monthlyGrowth = followerGrowthRate / 100;
    const projected30Day = Math.round(totalFollowers * (1 + monthlyGrowth));
    const projected90Day = Math.round(totalFollowers * Math.pow(1 + monthlyGrowth, 3));
    const projected1Year = Math.round(totalFollowers * Math.pow(1 + monthlyGrowth, 12));
    
    // Growth trend analysis
    let growthTrend: GrowthAnalysis['growthTrend'];
    if (followerGrowthRate > 8) growthTrend = 'EXPONENTIAL';
    else if (followerGrowthRate > 5) growthTrend = 'LINEAR';
    else if (followerGrowthRate < 2) growthTrend = 'DECLINING';
    else growthTrend = 'VOLATILE';

    return {
      followerGrowthRate: Math.round(followerGrowthRate * 10) / 10,
      engagementGrowthRate: Math.round(engagementGrowthRate * 10) / 10,
      projected30Day,
      projected90Day,
      projected1Year,
      growthTrend
    };
  }

  /**
   * Market Analysis Algorithm
   */
  private static analyzeMarket(profile: InfluencerProfile): MarketAnalysis {
    const totalFollowers = profile.socialPlatforms.reduce((sum, p) => sum + p.followers, 0);
    
    // Mock competitor analysis (would use real market data)
    const competitorRanking = Math.round(Math.random() * 95 + 5); // 5-100 percentile
    const marketShare = Math.min(5, (totalFollowers / 1000000) * 100); // Market share percentage
    
    // Niche dominance calculation
    const categoryBonus = this.getCategoryBonus(profile.categories);
    const nicheDominance = Math.min(100, (categoryBonus / 2) + (Math.random() * 30));
    
    // Brand affinity score
    const brandAffinityScore = Math.min(100, 
      (profile.socialPlatforms.length * 15) + 
      (Math.random() * 40) +
      categoryBonus
    );
    
    // Cross-platform synergy
    const crossPlatformSynergy = Math.min(100, profile.socialPlatforms.length * 20 + (Math.random() * 20));

    return {
      competitorRanking,
      marketShare: Math.round(marketShare * 100) / 100,
      nicheDominance: Math.round(nicheDominance * 10) / 10,
      brandAffinityScore: Math.round(brandAffinityScore * 10) / 10,
      crossPlatformSynergy: Math.round(crossPlatformSynergy * 10) / 10
    };
  }

  /**
   * Performance Metrics Calculation
   */
  private static calculatePerformance(profile: InfluencerProfile): PerformanceMetrics {
    const avgEngagement = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length;
    
    // Reach efficiency (engagement rate normalized)
    const reachEfficiency = Math.min(100, avgEngagement * 3);
    
    // Content quality score (based on engagement and platform diversity)
    const contentQualityScore = Math.min(100, 
      (avgEngagement * 2) + 
      (profile.socialPlatforms.length * 10) +
      (Math.random() * 20)
    );
    
    // Audience alignment (how well audience matches brand categories)
    const audienceAlignment = Math.min(100, this.getCategoryBonus(profile.categories) + (Math.random() * 30));
    
    // Brand safety score
    const brandSafety = Math.round(85 + (Math.random() * 15)); // 85-100
    
    // Viral potential
    const viralPotential = Math.min(100, 
      (avgEngagement * 1.5) + 
      (profile.socialPlatforms.length * 8) +
      (Math.random() * 25)
    );

    return {
      reachEfficiency: Math.round(reachEfficiency * 10) / 10,
      contentQualityScore: Math.round(contentQualityScore * 10) / 10,
      audienceAlignment: Math.round(audienceAlignment * 10) / 10,
      brandSafety,
      viralPotential: Math.round(viralPotential * 10) / 10
    };
  }

  /**
   * Prediction Metrics Generation
   */
  private static generatePredictions(profile: InfluencerProfile): PredictionMetrics {
    const totalFollowers = profile.socialPlatforms.reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length;
    
    // Expected campaign reach (accounting for organic reach rates)
    const expectedCampaignReach = Math.round(totalFollowers * 0.6 * (avgEngagement / 100));
    
    // Predicted engagement rate
    const predictedEngagementRate = Math.max(1, avgEngagement * (0.8 + Math.random() * 0.4));
    
    // Conversion probability
    const conversionProbability = Math.min(15, (avgEngagement * 0.3) + (Math.random() * 5));
    
    // Brand lift expectation
    const brandLiftExpectation = Math.min(50, (avgEngagement * 0.8) + (Math.random() * 15));
    
    // Risk assessment
    let riskAssessment: PredictionMetrics['riskAssessment'];
    if (avgEngagement > 7 && totalFollowers > 10000) riskAssessment = 'LOW';
    else if (avgEngagement > 4 && totalFollowers > 5000) riskAssessment = 'MEDIUM';
    else riskAssessment = 'HIGH';

    return {
      expectedCampaignReach,
      predictedEngagementRate: Math.round(predictedEngagementRate * 10) / 10,
      conversionProbability: Math.round(conversionProbability * 10) / 10,
      brandLiftExpectation: Math.round(brandLiftExpectation * 10) / 10,
      riskAssessment
    };
  }

  // Helper methods
  private static calculateQualityMultiplier(profile: InfluencerProfile): number {
    let multiplier = 1.0;
    
    // Platform diversity bonus
    if (profile.socialPlatforms.length >= 3) multiplier += 0.2;
    if (profile.socialPlatforms.length >= 4) multiplier += 0.1;
    
    // High engagement bonus
    const avgEngagement = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length;
    if (avgEngagement > 5) multiplier += 0.3;
    if (avgEngagement > 8) multiplier += 0.2;
    
    // Category relevance bonus
    multiplier += this.getCategoryBonus(profile.categories) / 100;
    
    return multiplier;
  }

  private static getCategoryBonus(categories: string[]): number {
    const highValueCategories = ['Tech', 'Fashion', 'Beauty', 'Fitness', 'Lifestyle', 'Business'];
    const matches = categories.filter(cat => 
      highValueCategories.some(hvc => cat.toLowerCase().includes(hvc.toLowerCase()))
    );
    return Math.min(30, matches.length * 10);
  }

  private static calculateOptimalTimes(platform: string): string[] {
    const timeMap: { [key: string]: string[] } = {
      'Instagram': ['9:00 AM', '2:00 PM', '5:00 PM'],
      'YouTube': ['2:00 PM', '4:00 PM', '8:00 PM'],
      'TikTok': ['6:00 AM', '10:00 AM', '7:00 PM'],
      'Twitter': ['8:00 AM', '12:00 PM', '5:00 PM'],
      'Facebook': ['9:00 AM', '1:00 PM', '3:00 PM']
    };
    
    return timeMap[platform] || ['9:00 AM', '2:00 PM', '6:00 PM'];
  }

  /**
   * Generate time series data based on real platform data
   */
  static generateTimeSeriesData(days: number = 30, realPlatforms: any[] = []): Array<{
    date: string;
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
  }> {
    const data = [];
    const today = new Date();
    
    const totalFollowers = realPlatforms.reduce((sum, p) => {
      let followers = p.followers || 0;
      if (p.platform === 'YouTube' && p.profileData?.subscriberCount) {
        followers = p.profileData.subscriberCount;
      }
      return sum + followers;
    }, 0);
    
    const avgEngagement = realPlatforms.length > 0 
      ? realPlatforms.reduce((sum, p) => sum + this.getPlatformEngagementRate(p), 0) / realPlatforms.length
      : 3.5;
    
    const baseFollowers = totalFollowers || 25000;
    const baseEngagement = avgEngagement || 3.5;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const growthFactor = 1 + (Math.random() - 0.5) * 0.1;
      const dayProgress = (days - i) / days;
      
      const followers = Math.round(baseFollowers * (0.9 + dayProgress * 0.1) * growthFactor);
      const engagement = Math.round((baseEngagement + Math.random() * 2 - 1) * 100) / 100;
      const reach = Math.round(followers * (engagement / 100) * (8 + Math.random() * 4));
      const impressions = Math.round(reach * (2 + Math.random() * 2));
      
      data.push({
        date: date.toISOString().split('T')[0],
        followers,
        engagement,
        reach,
        impressions
      });
    }
    
    return data;
  }

  /**
   * Generate platform data from real connected platforms
   */
  static generatePlatformData(realPlatforms: any[] = []): Array<{
    platform: string;
    followers: number;
    engagement: number;
    posts: number;
    avgLikes: number;
  }> {
    if (realPlatforms.length === 0) {
      return [];
    }

    return realPlatforms.map(platform => {
      let followers = platform.followers || 0;
      
      if (platform.platform === 'YouTube' && platform.profileData?.subscriberCount) {
        followers = platform.profileData.subscriberCount;
      }
      
      let baseEngagement = 3.5;
      switch (platform.platform) {
        case 'Instagram':
          baseEngagement = followers < 10000 ? 6.5 : followers < 100000 ? 4.2 : 2.8;
          break;
        case 'YouTube':
          baseEngagement = followers < 1000 ? 12.5 : followers < 10000 ? 8.5 : followers < 100000 ? 5.8 : 3.2;
          break;
        case 'LinkedIn':
          baseEngagement = followers < 5000 ? 4.8 : followers < 50000 ? 3.2 : 2.1;
          break;
        case 'Twitter':
          baseEngagement = followers < 10000 ? 3.2 : followers < 100000 ? 2.1 : 1.5;
          break;
        case 'Facebook':
          baseEngagement = followers < 10000 ? 4.5 : followers < 100000 ? 2.8 : 1.8;
          break;
      }
      
      const engagement = baseEngagement + (Math.random() - 0.5) * 1.5;
      
      const posts = platform.profileData?.mediaCount || 
                   platform.profileData?.videoCount || 
                   Math.floor(50 + Math.random() * 150);
      
      const avgLikes = Math.round(followers * (engagement / 100));
      
      return {
        platform: platform.platform,
        followers,
        engagement: Math.round(engagement * 10) / 10,
        posts,
        avgLikes
      };
    });
  }

  /**
   * Enhanced platform analysis using real data
   */
  static analyzeRealPlatformPerformance(realPlatforms: any[]): {
    totalReach: number;
    avgEngagement: number;
    topPlatform: string;
    growthPotential: string;
    platformDiversity: number;
  } {
    if (realPlatforms.length === 0) {
      return {
        totalReach: 0,
        avgEngagement: 0,
        topPlatform: 'None',
        growthPotential: 'Low',
        platformDiversity: 0
      };
    }

    const totalReach = realPlatforms.reduce((sum, p) => sum + (p.followers || 0), 0);
    
    // Calculate weighted average engagement
    const weightedEngagement = realPlatforms.reduce((sum, p) => {
      const followers = p.followers || 0;
      const engagement = this.getPlatformEngagementRate(p);
      return sum + (followers * engagement);
    }, 0) / totalReach;

    // Find top platform by followers
    const topPlatform = realPlatforms.reduce((top, current) => 
      (current.followers || 0) > (top.followers || 0) ? current : top
    ).platform;

    // Calculate growth potential based on platform mix and follower distribution
    let growthPotential = 'Medium';
    if (realPlatforms.length >= 3 && totalReach > 50000) growthPotential = 'High';
    else if (realPlatforms.length >= 2 && totalReach > 10000) growthPotential = 'Medium';
    else growthPotential = 'Low';

    // Platform diversity score (0-100)
    const platformDiversity = Math.min(100, realPlatforms.length * 20 + 
      (realPlatforms.length > 1 ? 20 : 0)); // Bonus for multiple platforms

    return {
      totalReach,
      avgEngagement: Math.round(weightedEngagement * 10) / 10,
      topPlatform,
      growthPotential,
      platformDiversity
    };
  }

  /**
   * Get engagement rate for a platform based on real or estimated data
   */
  static getPlatformEngagementRate(platform: any): number {
    // Use real engagement rate if available
    if (platform.profileData?.engagementRate) {
      return platform.profileData.engagementRate;
    }

    let followers = platform.followers || 0;
    
    if (platform.platform === 'YouTube' && platform.profileData?.subscriberCount) {
      followers = platform.profileData.subscriberCount;
    }
    
    switch (platform.platform) {
      case 'Instagram':
        return followers < 10000 ? 6.5 : followers < 100000 ? 4.2 : 2.8;
      case 'YouTube':
        // Fallback to estimated engagement if real data not available
        return followers < 1000 ? 12.5 : followers < 10000 ? 8.5 : followers < 100000 ? 5.8 : 3.2;
      case 'LinkedIn':
        return followers < 5000 ? 4.8 : followers < 50000 ? 3.2 : 2.1;
      case 'Twitter':
        return followers < 10000 ? 3.2 : followers < 100000 ? 2.1 : 1.5;
      case 'Facebook':
        return followers < 10000 ? 4.5 : followers < 100000 ? 2.8 : 1.8;
      default:
        return 3.5;
    }
  }

  /**
   * REACHEE SCORE ALGORITHM (0-100)
   * 
   * The Reachee Score is a comprehensive KPI that evaluates influencer performance
   * across 6 weighted dimensions to produce a final score out of 100:
   * 
   * 1. REACH (25%): Audience size, platform diversity, platform quality
   * 2. ENGAGEMENT (30%): Engagement rates, consistency, platform performance  
   * 3. GROWTH (20%): Growth trajectory, stability, platform expansion
   * 4. QUALITY (15%): Content categories, niche authority, posting frequency
   * 5. RELIABILITY (5%): Platform verification, account stability, pricing
   * 6. MARKET VALUE (5%): ROI potential, market demand, competitive position
   * 
   * Final Score = (Reach × 0.25) + (Engagement × 0.30) + (Growth × 0.20) + 
   *               (Quality × 0.15) + (Reliability × 0.05) + (MarketValue × 0.05)
   */
  private static calculateReacheeScore(profile: InfluencerProfile): ReacheeScore {
    const totalFollowers = profile.socialPlatforms.reduce((sum, p) => sum + p.followers, 0);
    const avgEngagement = profile.socialPlatforms.length > 0 
      ? profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length 
      : 0;
    
    // Calculate each component (0-100)
    const reachScore = this.calculateReachComponent(profile, totalFollowers);
    const engagementScore = this.calculateEngagementComponent(profile, avgEngagement);
    const growthScore = this.calculateGrowthComponent(profile, totalFollowers);
    const qualityScore = this.calculateQualityComponent(profile);
    const reliabilityScore = this.calculateReliabilityComponent(profile);
    const marketValueScore = this.calculateMarketValueComponent(profile);
    
    // Calculate weighted final score (0-100)
    const weightedScore = 
      (reachScore * 0.25) +
      (engagementScore * 0.30) +
      (growthScore * 0.20) +
      (qualityScore * 0.15) +
      (reliabilityScore * 0.05) +
      (marketValueScore * 0.05);
    
    // Ensure score is between 0-100
    const overall = Math.max(0, Math.min(100, Math.round(weightedScore)));
    
    // Determine rating based on score
    let rating: ReacheeScore['rating'];
    if (overall >= 90) rating = 'ELITE';
    else if (overall >= 75) rating = 'EXCELLENT';
    else if (overall >= 60) rating = 'GOOD';
    else if (overall >= 40) rating = 'FAIR';
    else rating = 'POOR';
    
    // Build breakdown object
    const breakdown = {
      reach: Math.round(reachScore),
      engagement: Math.round(engagementScore),
      growth: Math.round(growthScore),
      quality: Math.round(qualityScore),
      reliability: Math.round(reliabilityScore),
      marketValue: Math.round(marketValueScore)
    };
    
    // Generate insights
    const { strengths, improvements } = this.generateInsights(breakdown);
    
    // Calculate percentile rank (0-99)
    const percentileRank = Math.min(99, Math.max(1, Math.round((overall / 100) * 90 + Math.random() * 9)));
    
    return {
      overall,
      rating,
      breakdown,
      strengths,
      improvements,
      percentileRank
    };
  }

  /**
   * REACH COMPONENT (0-100)
   * Evaluates audience size and platform presence
   */
  private static calculateReachComponent(profile: InfluencerProfile, totalFollowers: number): number {
    let score = 0;
    
    // Follower count score (0-40 points) - logarithmic scale
    if (totalFollowers > 0) {
      score += Math.min(40, Math.log10(totalFollowers) * 8);
    }
    
    // Platform diversity (0-25 points)
    const platformCount = profile.socialPlatforms.length;
    score += Math.min(25, platformCount * 6);
    
    // Platform quality bonus (0-20 points)
    const platformQuality = profile.socialPlatforms.reduce((total, platform) => {
      const qualityScores = {
        'YouTube': 5,
        'Instagram': 4,
        'LinkedIn': 4,
        'TikTok': 3,
        'Twitter': 3,
        'Facebook': 2
      };
      return total + (qualityScores[platform.platform as keyof typeof qualityScores] || 2);
    }, 0);
    score += Math.min(20, platformQuality);
    
    // Geographic reach (0-15 points)
    const isGlobal = profile.location && 
      ['Global', 'International', 'Worldwide', 'Multi-region'].some(keyword => 
        profile.location.toLowerCase().includes(keyword.toLowerCase())
      );
    score += isGlobal ? 15 : 10;
    
    return Math.min(100, score);
  }

  /**
   * ENGAGEMENT COMPONENT (0-100)
   * Evaluates audience interaction and engagement quality
   */
  private static calculateEngagementComponent(profile: InfluencerProfile, avgEngagement: number): number {
    let score = 0;
    
    // Base engagement score (0-50 points)
    score += Math.min(50, avgEngagement * 8);
    
    // Engagement consistency across platforms (0-25 points)
    if (profile.socialPlatforms.length > 1) {
      const engagements = profile.socialPlatforms.map(p => p.engagement);
      const mean = engagements.reduce((sum, val) => sum + val, 0) / engagements.length;
      const variance = engagements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / engagements.length;
      const consistency = Math.max(0, 25 - variance);
      score += consistency;
    } else {
      score += 15; // Bonus for single platform focus
    }
    
    // Platform-specific performance (0-25 points)
    const platformPerformance = profile.socialPlatforms.reduce((total, platform) => {
      const benchmarks = {
        'Instagram': 3.5,
        'TikTok': 8.0,
        'YouTube': 2.5,
        'LinkedIn': 3.0,
        'Twitter': 2.0,
        'Facebook': 1.5
      };
      const benchmark = benchmarks[platform.platform as keyof typeof benchmarks] || 2.5;
      const performance = Math.min(5, (platform.engagement / benchmark) * 2.5);
      return total + performance;
    }, 0);
    score += Math.min(25, platformPerformance);
    
    return Math.min(100, score);
  }

  /**
   * GROWTH COMPONENT (0-100)
   * Evaluates growth potential and trajectory
   */
  private static calculateGrowthComponent(profile: InfluencerProfile, totalFollowers: number): number {
    let score = 0;
    
    // Simulated growth rate (0-40 points) - in real app, use historical data
    const mockGrowthRate = 5 + Math.random() * 15; // 5-20% monthly
    score += Math.min(40, mockGrowthRate * 2);
    
    // Account maturity/stability (0-30 points)
    if (totalFollowers >= 100000) score += 30;
    else if (totalFollowers >= 50000) score += 25;
    else if (totalFollowers >= 10000) score += 20;
    else if (totalFollowers >= 1000) score += 15;
    else score += 10;
    
    // Platform expansion potential (0-30 points)
    const maxPlatforms = 5;
    const platformDiversity = (profile.socialPlatforms.length / maxPlatforms) * 30;
    score += Math.min(30, platformDiversity);
    
    return Math.min(100, score);
  }

  /**
   * QUALITY COMPONENT (0-100)
   * Evaluates content quality and professional setup
   */
  private static calculateQualityComponent(profile: InfluencerProfile): number {
    let score = 0;
    
    // Content categories (0-25 points)
    score += Math.min(25, profile.categories.length * 6);
    
    // Niche authority (0-25 points)
    const highValueNiches = ['Technology', 'Fashion', 'Beauty', 'Fitness', 'Gaming', 'Food', 'Travel', 'Business'];
    const authorityBonus = profile.categories.filter(cat => 
      highValueNiches.some(niche => cat.toLowerCase().includes(niche.toLowerCase()))
    ).length * 6;
    score += Math.min(25, authorityBonus);
    
    // Content production (0-25 points)
    const avgPosts = profile.socialPlatforms.reduce((sum, p) => sum + p.posts, 0) / profile.socialPlatforms.length;
    if (avgPosts >= 100) score += 25;
    else if (avgPosts >= 50) score += 20;
    else if (avgPosts >= 20) score += 15;
    else if (avgPosts >= 10) score += 10;
    else score += 5;
    
    // Professional setup (0-25 points)
    if (profile.minimumRate > 0) {
      if (profile.minimumRate >= 1000) score += 25;
      else if (profile.minimumRate >= 500) score += 20;
      else if (profile.minimumRate >= 100) score += 15;
      else score += 10;
    } else {
      score += 5; // Some credit for having a profile
    }
    
    return Math.min(100, score);
  }

  /**
   * RELIABILITY COMPONENT (0-100)
   * Evaluates trustworthiness and professional credibility
   */
  private static calculateReliabilityComponent(profile: InfluencerProfile): number {
    let score = 0;
    
    // Platform verification (0-40 points)
    score += Math.min(40, profile.socialPlatforms.length * 8);
    
    // Account maturity (0-30 points) - mock calculation
    score += 25; // Would calculate from account creation dates
    
    // Professional pricing structure (0-30 points)
    if (profile.minimumRate > 0 && profile.minimumRate <= 10000) {
      score += 30;
    } else if (profile.minimumRate > 10000) {
      score += 20; // High rates might indicate lower accessibility
    } else {
      score += 10; // No rate structure
    }
    
    return Math.min(100, score);
  }

  /**
   * MARKET VALUE COMPONENT (0-100)
   * Evaluates commercial potential and market positioning
   */
  private static calculateMarketValueComponent(profile: InfluencerProfile): number {
    let score = 0;
    
    // ROI potential (0-40 points)
    const roi = this.calculateROI(profile);
    score += Math.min(40, roi.expectedROI / 10);
    
    // Market demand for categories (0-30 points)
    const highDemandCategories = ['Technology', 'Fashion', 'Beauty', 'Gaming', 'Fitness', 'Business'];
    const demandBonus = profile.categories.filter(cat =>
      highDemandCategories.some(demand => cat.toLowerCase().includes(demand.toLowerCase()))
    ).length * 8;
    score += Math.min(30, demandBonus);
    
    // Competitive advantage (0-30 points) - mock calculation
    const platformAdvantage = profile.socialPlatforms.length >= 3 ? 15 : 10;
    const engagementAdvantage = profile.socialPlatforms.reduce((sum, p) => sum + p.engagement, 0) / profile.socialPlatforms.length > 5 ? 15 : 10;
    score += platformAdvantage + engagementAdvantage;
    
    return Math.min(100, score);
  }

  private static generateInsights(breakdown: ReacheeScore['breakdown']): {
    strengths: string[];
    improvements: string[];
  } {
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Analyze each component
    Object.entries(breakdown).forEach(([key, value]) => {
      if (value >= 80) {
        switch (key) {
          case 'reach':
            strengths.push('Exceptional audience reach across platforms');
            break;
          case 'engagement':
            strengths.push('Outstanding engagement rates and audience connection');
            break;
          case 'growth':
            strengths.push('Strong growth trajectory and momentum');
            break;
          case 'quality':
            strengths.push('High-quality content and professional setup');
            break;
          case 'reliability':
            strengths.push('Verified and trustworthy profile');
            break;
          case 'marketValue':
            strengths.push('High market value and ROI potential');
            break;
        }
      } else if (value < 60) {
        switch (key) {
          case 'reach':
            improvements.push('Expand audience reach and platform presence');
            break;
          case 'engagement':
            improvements.push('Improve audience engagement and interaction');
            break;
          case 'growth':
            improvements.push('Focus on sustainable growth strategies');
            break;
          case 'quality':
            improvements.push('Enhance content quality and consistency');
            break;
          case 'reliability':
            improvements.push('Complete profile verification and setup');
            break;
          case 'marketValue':
            improvements.push('Optimize pricing and market positioning');
            break;
        }
      }
    });
    
    // Ensure we have at least some insights
    if (strengths.length === 0) {
      strengths.push('Active across multiple social platforms');
    }
    if (improvements.length === 0) {
      improvements.push('Continue maintaining consistent content quality');
    }
    
    return { strengths, improvements };
  }

  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
} 