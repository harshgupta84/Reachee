'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/useAuthStore';

const steps = [
  {
    id: 'profile',
    name: 'Basic Profile',
    fields: ['bio', 'location'],
  },
  {
    id: 'categories',
    name: 'Content Categories',
    fields: ['contentCategories'],
  },
  {
    id: 'social',
    name: 'Social Accounts',
    fields: ['instagramHandle', 'tiktokHandle', 'youtubeHandle'],
  },
  {
    id: 'rates',
    name: 'Rates & Preferences',
    fields: ['minimumRate', 'preferredContentTypes'],
  },
];

const formSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  location: z.string().min(2, 'Please enter a valid location'),
  contentCategories: z.string().min(2, 'Please select at least one category'),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  minimumRate: z.string().min(1, 'Please enter a minimum rate'),
  preferredContentTypes: z.string().min(2, 'Please select at least one content type'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InfluencerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: '',
      location: '',
      contentCategories: '',
      instagramHandle: '',
      tiktokHandle: '',
      youtubeHandle: '',
      minimumRate: '',
      preferredContentTypes: '',
    },
    mode: 'onChange',
  });

  const { isSubmitting, isValid } = form.formState;

  function onSubmit(values: FormValues) {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Submit the data to API
    toast.promise(
      async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      },
      {
        loading: 'Saving your profile...',
        success: () => {
          router.push('/dashboard');
          return 'Profile created successfully!';
        },
        error: 'Failed to create profile',
      }
    );
  }

  const currentFields = steps[currentStep].fields;

  return (
    <div className="container grid flex-1 items-center justify-center py-10 md:py-20">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Influencer Profile</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell brands about yourself and what content you create" {...field} />
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
                </>
              )}

              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="contentCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Categories</FormLabel>
                      <FormControl>
                        <Input placeholder="Fashion, Beauty, Lifestyle, Tech, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple categories with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="instagramHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Username</FormLabel>
                        <FormControl>
                          <Input placeholder="@yourusername" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktokHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok Username</FormLabel>
                        <FormControl>
                          <Input placeholder="@yourusername" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtubeHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Channel</FormLabel>
                        <FormControl>
                          <Input placeholder="Your channel name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="minimumRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Rate (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          The minimum amount you charge per post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredContentTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Content Types</FormLabel>
                        <FormControl>
                          <Input placeholder="Posts, Stories, Reels, Videos, etc." {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate multiple types with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Back
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex gap-1">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`h-2 w-10 rounded-full ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 