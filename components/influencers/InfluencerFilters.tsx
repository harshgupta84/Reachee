'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search } from 'lucide-react';
import type { InfluencerFilters } from '@/types/influencer';

interface InfluencerFiltersProps {
  filters: InfluencerFilters;
  onFiltersChange: (filters: Partial<InfluencerFilters>) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const CATEGORIES = [
  'Fashion', 'Beauty', 'Fitness', 'Food', 'Travel', 'Technology', 
  'Gaming', 'Lifestyle', 'Business', 'Health', 'Education', 'Entertainment'
];

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];

const FOLLOWER_RANGES = [
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K - 100K', min: 10000, max: 100000 },
  { label: '100K - 1M', min: 100000, max: 1000000 },
  { label: '1M+', min: 1000000, max: undefined },
];

export function InfluencerFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalResults 
}: InfluencerFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    onFiltersChange({ categories: newCategories });
  };

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = filters.platforms || [];
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    onFiltersChange({ platforms: newPlatforms });
  };

  const handleFollowerRangeChange = (range: typeof FOLLOWER_RANGES[0]) => {
    onFiltersChange({
      minFollowers: range.min,
      maxFollowers: range.max,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.categories?.length) count++;
    if (filters.platforms?.length) count++;
    if (filters.minFollowers || filters.maxFollowers) count++;
    if (filters.minEngagement || filters.maxEngagement) count++;
    if (filters.verified !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalResults} results
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-8"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search influencers..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="Enter location..."
              value={filters.location || ''}
              onChange={(e) => onFiltersChange({ location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Verification Status</Label>
            <Select
              value={filters.verified?.toString() || 'all'}
              onValueChange={(value) => 
                onFiltersChange({ 
                  verified: value === 'all' ? undefined : value === 'true' 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified Only</SelectItem>
                <SelectItem value="false">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Follower Range</Label>
            <Select
              value={
                filters.minFollowers 
                  ? `${filters.minFollowers}-${filters.maxFollowers || 'max'}`
                  : 'any'
              }
              onValueChange={(value) => {
                if (value === 'any') {
                  onFiltersChange({ minFollowers: undefined, maxFollowers: undefined });
                  return;
                }
                const range = FOLLOWER_RANGES.find(r => 
                  `${r.min}-${r.max || 'max'}` === value
                );
                if (range) handleFollowerRangeChange(range);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any range</SelectItem>
                {FOLLOWER_RANGES.map((range) => (
                  <SelectItem 
                    key={`${range.min}-${range.max || 'max'}`}
                    value={`${range.min}-${range.max || 'max'}`}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            <div className="space-y-3">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.categories?.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    {filters.categories?.includes(category) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {PLATFORMS.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={filters.platforms?.includes(platform) || false}
                      onCheckedChange={() => handlePlatformToggle(platform)}
                    />
                    <Label
                      htmlFor={platform}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Engagement Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  value={filters.minEngagement || ''}
                  onChange={(e) => 
                    onFiltersChange({ 
                      minEngagement: e.target.value ? parseFloat(e.target.value) : undefined 
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Engagement Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  min="0"
                  max="100"
                  step="0.1"
                  value={filters.maxEngagement || ''}
                  onChange={(e) => 
                    onFiltersChange({ 
                      maxEngagement: e.target.value ? parseFloat(e.target.value) : undefined 
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 