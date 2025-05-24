'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  categories: string[];
  status: string;
  createdAt: Date;
  brandName: string;
}

export function CampaignCard({
  id,
  title,
  description,
  budget,
  deadline,
  categories,
  status,
  createdAt,
  brandName,
}: CampaignCardProps) {
  const isOpen = status === 'OPEN';
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(budget);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const deadlineFormatted = formatDistanceToNow(new Date(deadline), { addSuffix: true });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">
              by <span className="font-medium">{brandName}</span> · {timeAgo}
            </CardDescription>
          </div>
          <Badge variant={isOpen ? 'default' : 'secondary'}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formattedBudget}</span>
          <span className="text-xs text-muted-foreground">Deadline: {deadlineFormatted}</span>
        </div>
        <Button size="sm" disabled={!isOpen} asChild>
          <Link href={`/campaigns/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 