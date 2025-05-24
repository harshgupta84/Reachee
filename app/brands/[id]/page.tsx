'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Building, ExternalLink, Star, Calendar, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

export default function BrandProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrand() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/brands/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Brand not found');
          }
          throw new Error('Failed to fetch brand');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setBrand(data.data.brand);
        } else {
          throw new Error(data.message || 'Failed to fetch brand');
        }
      } catch (err) {
        console.error('Error fetching brand:', err);
        setError(err instanceof Error ? err.message : 'Failed to load brand');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchBrand();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="flex items-start gap-6 mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center py-10">
        <p className="text-center text-lg text-destructive mb-4">{error}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center py-10">
        <p className="text-center text-lg">Brand not found.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const timeAgo = formatDistanceToNow(new Date(brand.createdAt), { addSuffix: true });

  return (
    <div className="py-10">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back to Brands
        </Button>
        
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={brand.logo} alt={brand.companyName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials(brand.companyName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{brand.companyName}</h1>
              {brand.verified && (
                <Star className="h-6 w-6 fill-primary text-primary" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
              {brand.industry && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{brand.industry}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {timeAgo}</span>
              </div>
            </div>
            
            {brand.website && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {brand.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {brand.verified && (
            <Badge variant="outline" className="text-primary border-primary">
              <Award className="h-3 w-3 mr-1" />
              Verified Brand
            </Badge>
          )}
          {brand.industry && (
            <Badge variant="secondary">
              {brand.industry}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {brand.description ? (
            <Card>
              <CardHeader>
                <CardTitle>About {brand.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {brand.description}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No description available for this brand.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brand.industry && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <Badge variant="secondary">{brand.industry}</Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification Status</span>
                <Badge variant={brand.verified ? "default" : "secondary"}>
                  {brand.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-sm">{timeAgo}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" size="lg">
                Contact Brand
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Start a conversation about potential collaborations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 