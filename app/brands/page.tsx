'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Building, MapPin, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

type Brand = {
  id: string;
  companyName: string;
  website?: string;
  industry?: string;
  logo?: string;
  description?: string;
  verified: boolean;
  createdAt: string;
};

type ApiResponse = {
  status: string;
  data: {
    brands: Brand[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const industries = [
    'all',
    'Technology',
    'Fashion',
    'Beauty',
    'Food & Beverage',
    'Travel',
    'Fitness',
    'Gaming',
    'Education',
    'Healthcare',
    'Finance',
    'Retail',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    async function fetchBrands() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/brands');
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.status === 'success') {
          setBrands(data.data.brands);
          setFilteredBrands(data.data.brands);
        } else {
          throw new Error(data.status);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrands();
  }, []);

  useEffect(() => {
    let filtered = brands;

    if (searchQuery.trim()) {
      filtered = filtered.filter((brand) =>
        brand.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (industryFilter !== 'all') {
      filtered = filtered.filter((brand) => brand.industry === industryFilter);
    }

    setFilteredBrands(filtered);
  }, [searchQuery, industryFilter, brands]);

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center py-10">
        <p className="text-center text-lg text-destructive">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground">
          Discover brands looking for influencer partnerships and collaborations.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search brands, industries, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry === 'all' ? 'All Industries' : industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBrands.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center py-10">
          <p className="text-center text-lg">
            {searchQuery || industryFilter !== 'all'
              ? 'No brands found matching your criteria.'
              : 'No brands found.'
            }
          </p>
          {(searchQuery || industryFilter !== 'all') && (
            <div className="mt-4 flex gap-2">
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
              {industryFilter !== 'all' && (
                <Button
                  variant="outline"
                  onClick={() => setIndustryFilter('all')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={brand.logo} alt={brand.companyName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(brand.companyName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="line-clamp-1 text-lg">{brand.companyName}</CardTitle>
              {brand.verified && (
                <Star className="h-4 w-4 fill-primary text-primary" />
              )}
            </div>
            {brand.industry && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {brand.industry}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {brand.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
            {brand.description}
          </p>
        )}
        
        <div className="space-y-2">
          {brand.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary truncate"
              >
                {brand.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="border-t bg-muted/30 px-6 py-3">
        <Button className="w-full" size="sm" asChild>
          <Link href={`/brands/${brand.id}`}>View Profile</Link>
        </Button>
      </div>
    </Card>
  );
} 