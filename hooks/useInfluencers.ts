import { useState, useEffect, useCallback } from 'react';
import { InfluencerListItem, InfluencerFilters, InfluencerSortOptions, InfluencerListResponse } from '@/types/influencer';

interface UseInfluencersOptions {
  initialFilters?: Partial<InfluencerFilters>;
  initialSort?: InfluencerSortOptions;
  limit?: number;
}

export function useInfluencers(options: UseInfluencersOptions = {}) {
  const [influencers, setInfluencers] = useState<InfluencerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<InfluencerFilters>({
    ...options.initialFilters,
  });

  const [sort, setSort] = useState<InfluencerSortOptions>({
    field: 'totalFollowers',
    direction: 'desc',
    ...options.initialSort,
  });

  const limit = options.limit || 12;

  const buildQueryParams = useCallback((page: number = 1) => {
    const params = new URLSearchParams();
    
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);

    if (filters.location) params.set('location', filters.location);
    if (filters.categories?.length) params.set('categories', filters.categories.join(','));
    if (filters.minFollowers) params.set('minFollowers', filters.minFollowers.toString());
    if (filters.maxFollowers) params.set('maxFollowers', filters.maxFollowers.toString());
    if (filters.verified !== undefined) params.set('verified', filters.verified.toString());
    if (filters.platforms?.length) params.set('platforms', filters.platforms.join(','));
    if (filters.minEngagement) params.set('minEngagement', filters.minEngagement.toString());
    if (filters.maxEngagement) params.set('maxEngagement', filters.maxEngagement.toString());
    if (filters.search) params.set('search', filters.search);

    return params.toString();
  }, [filters, sort, limit]);

  const fetchInfluencers = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = buildQueryParams(page);
      const response = await fetch(`/api/influencers?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch influencers');
      }

      const data: InfluencerListResponse = await response.json();
      
      if (append) {
        setInfluencers(prev => [...prev, ...data.influencers]);
      } else {
        setInfluencers(data.influencers);
      }
      
      setHasMore(data.hasMore);
      setTotal(data.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  const updateFilters = useCallback((newFilters: Partial<InfluencerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const updateSort = useCallback((newSort: Partial<InfluencerSortOptions>) => {
    setSort(prev => ({ ...prev, ...newSort }));
    setCurrentPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchInfluencers(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchInfluencers]);

  const refresh = useCallback(() => {
    fetchInfluencers(1, false);
  }, [fetchInfluencers]);

  useEffect(() => {
    fetchInfluencers(1, false);
  }, [fetchInfluencers]);

  return {
    influencers,
    loading,
    error,
    hasMore,
    total,
    currentPage,
    filters,
    sort,
    updateFilters,
    clearFilters,
    updateSort,
    loadMore,
    refresh,
  };
} 