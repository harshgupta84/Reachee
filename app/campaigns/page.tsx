'use client';

import { useEffect, useState } from 'react';
import { CampaignCard } from '@/components/shared/CampaignCard';
import { Skeleton } from '@/components/ui/skeleton';

type Campaign = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categories: string[];
  status: string;
  createdAt: string;
  brand: {
    companyName: string;
  };
};

type ApiResponse = {
  status: string;
  data: {
    campaigns: Campaign[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/campaigns');
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.status === 'success') {
          setCampaigns(data.data.campaigns);
        } else {
          throw new Error(data.status);
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
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

  // Show error message
  if (error) {
    return (
      <div className="container flex h-[50vh] flex-col items-center justify-center py-10">
        <p className="text-center text-lg text-destructive">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show empty state
  if (campaigns.length === 0) {
    return (
      <div className="container flex h-[50vh] flex-col items-center justify-center py-10">
        <p className="text-center text-lg">No campaigns found.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Browse and apply to the latest brand campaigns looking for influencers.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            id={campaign.id}
            title={campaign.title}
            description={campaign.description}
            budget={campaign.budget}
            deadline={new Date(campaign.deadline)}
            categories={campaign.categories}
            status={campaign.status}
            createdAt={new Date(campaign.createdAt)}
            brandName={campaign.brand.companyName}
          />
        ))}
      </div>
    </div>
  );
} 