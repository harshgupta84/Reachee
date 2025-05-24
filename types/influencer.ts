export interface InfluencerListItem {
  id: string;
  userId: string;
  name?: string | null;
  email: string;
  image?: string | null;
  bio?: string | null;
  location?: string | null;
  categories: string[];
  verified: boolean;
  profileComplete: boolean;
  totalFollowers: number;
  averageEngagement?: number | null;
  socialPlatforms: {
    platform: string;
    username: string;
    followers: number;
  }[];
  createdAt: Date;
}

export interface InfluencerFilters {
  location?: string;
  categories?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  verified?: boolean;
  platforms?: string[];
  minEngagement?: number;
  maxEngagement?: number;
  search?: string;
}

export interface InfluencerSortOptions {
  field: 'name' | 'totalFollowers' | 'averageEngagement' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface InfluencerListResponse {
  influencers: InfluencerListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 