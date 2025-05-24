'use client';

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
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Please enter your industry'),
  website: z.string().url('Please enter a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preferredRegions: z.string().min(2, 'Please enter preferred regions'),
  preferredCategories: z.string().min(2, 'Please enter preferred categories'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BrandOnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      website: '',
      description: '',
      preferredRegions: '',
      preferredCategories: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch('/api/auth/onboarding/brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...values,
          paymentMethod: 'Credit Card', // Default for now
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      toast.success('Brand profile created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create brand profile');
    }
  };

  return (
    <div className="container grid flex-1 items-center justify-center py-10 md:py-20">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Brand Profile</CardTitle>
          <CardDescription>
            Tell us about your company to start finding influencers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Fashion, Tech, Food, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Main industry or sector of your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe your company and what it does" 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will help influencers understand your brand
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredRegions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Regions</FormLabel>
                    <FormControl>
                      <Input placeholder="United States, Europe, Global" {...field} />
                    </FormControl>
                    <FormDescription>
                      Which regions do you want to target?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Categories</FormLabel>
                    <FormControl>
                      <Input placeholder="Beauty, Fashion, Tech, Lifestyle" {...field} />
                    </FormControl>
                    <FormDescription>
                      What type of content are you looking for? (separate with commas)
                    </FormDescription>
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