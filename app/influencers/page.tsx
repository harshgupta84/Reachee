'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfluencerFilters } from '@/components/influencers/InfluencerFilters';
import { InfluencerSort } from '@/components/influencers/InfluencerSort';
import { InfluencerCard } from '@/components/influencers/InfluencerCard';
import { useInfluencers } from '@/hooks/useInfluencers';
import { Users, RefreshCw } from 'lucide-react';
import type { InfluencerListItem } from '@/types/influencer';

export default function InfluencersPage() {
  const {
    influencers,
    loading,
    error,
    hasMore,
    total,
    filters,
    sort,
    updateFilters,
    clearFilters,
    updateSort,
    loadMore,
    refresh,
  } = useInfluencers();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewProfile = (influencer: InfluencerListItem) => {
    window.open(`/influencers/${influencer.userId}`, '_blank');
  };

  const handleContact = (influencer: InfluencerListItem) => {
    window.open(`/messages?user=${influencer.userId}`, '_blank');
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  const renderInfluencers = () => {
    if (influencers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No influencers found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search criteria
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {influencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              onViewProfile={handleViewProfile}
              onContact={handleContact}
            />
          ))}
        </div>

        {hasMore && (
          <div className="text-center pt-8">
            <Button 
              onClick={loadMore} 
              variant="outline" 
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discover Influencers</h1>
          <p className="text-muted-foreground mt-2">
            Find and connect with top influencers across all platforms
          </p>
        </div>
        
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <InfluencerFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        totalResults={total}
      />

      <div className="flex items-center justify-between">
        <InfluencerSort
          sort={sort}
          onSortChange={updateSort}
        />
        
        <div className="text-sm text-muted-foreground">
          Showing {influencers.length} of {total} influencers
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="min-h-96">
        {loading && influencers.length === 0 ? renderSkeletons() : renderInfluencers()}
      </div>
    </div>
  );
} 