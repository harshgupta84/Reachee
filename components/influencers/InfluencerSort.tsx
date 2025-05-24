'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { InfluencerSortOptions } from '@/types/influencer';

interface InfluencerSortProps {
  sort: InfluencerSortOptions;
  onSortChange: (sort: Partial<InfluencerSortOptions>) => void;
}

const SORT_OPTIONS = [
  { value: 'totalFollowers', label: 'Total Followers' },
  { value: 'averageEngagement', label: 'Engagement Rate' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Date Joined' },
];

export function InfluencerSort({ sort, onSortChange }: InfluencerSortProps) {
  const handleFieldChange = (field: string) => {
    onSortChange({ field: field as InfluencerSortOptions['field'] });
  };

  const toggleDirection = () => {
    onSortChange({ 
      direction: sort.direction === 'asc' ? 'desc' : 'asc' 
    });
  };

  const currentOption = SORT_OPTIONS.find(option => option.value === sort.field);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sort.field} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select sorting..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDirection}
        className="px-3"
      >
        {sort.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
        <span className="ml-1 text-xs">
          {sort.direction === 'asc' ? 'Low to High' : 'High to Low'}
        </span>
      </Button>
    </div>
  );
} 