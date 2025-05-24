'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/useAuthStore';

const formSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  location: z.string().min(2, 'Please enter your location'),
  contentCategories: z.string().min(2, 'Please enter your content categories'),
  instagramHandle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InfluencerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: '',
      location: '',
      contentCategories: '',
      instagramHandle: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch('/api/auth/onboarding/influencer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          bio: values.bio,
          country: 'US', // Default for now
          city: values.location,
          contentCategories: values.contentCategories,
          instagramHandle: values.instagramHandle,
          tiktokHandle: '',
          youtubeHandle: '',
          minimumRate: '0', // Default, can be set in dashboard
          preferredContentTypes: values.contentCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    }
  };

  return (
    <div className="container grid flex-1 items-center justify-center py-10 md:py-20">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Influencer Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to get started with campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell brands about yourself and what content you create" 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A brief introduction about you and your content style
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where you're based (for location-based campaigns)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Categories</FormLabel>
                    <FormControl>
                      <Input placeholder="Fashion, Beauty, Fitness, Tech" {...field} />
                    </FormControl>
                    <FormDescription>
                      What type of content do you create? (separate with commas)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagramHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 