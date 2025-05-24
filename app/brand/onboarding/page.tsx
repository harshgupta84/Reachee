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
    id: 'company',
    name: 'Company Details',
    fields: ['companyName', 'industry', 'website'],
  },
  {
    id: 'description',
    name: 'Company Description',
    fields: ['description'],
  },
  {
    id: 'targeting',
    name: 'Campaign Targeting',
    fields: ['preferredRegions', 'preferredCategories'],
  },
  {
    id: 'payment',
    name: 'Payment Information',
    fields: ['paymentMethod'],
  },
];

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Please select an industry'),
  website: z.string().url('Please enter a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preferredRegions: z.string().min(2, 'Please enter at least one region'),
  preferredCategories: z.string().min(2, 'Please select at least one category'),
  paymentMethod: z.string().min(2, 'Please select a payment method'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BrandOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
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
      paymentMethod: '',
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
        loading: 'Creating your brand profile...',
        success: () => {
          router.push('/dashboard');
          return 'Brand profile created successfully!';
        },
        error: 'Failed to create brand profile',
      }
    );
  }

  return (
    <div className="container grid flex-1 items-center justify-center py-10 md:py-20">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Brand Profile</CardTitle>
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
                          <Input placeholder="https://yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell influencers about your brand, values, and products" 
                          className="h-40"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be visible to potential influencers
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
                    name="preferredRegions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Regions</FormLabel>
                        <FormControl>
                          <Input placeholder="US, Europe, Asia, etc." {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate multiple regions with commas
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
                        <FormLabel>Preferred Content Categories</FormLabel>
                        <FormControl>
                          <Input placeholder="Beauty, Fashion, Tech, etc." {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate multiple categories with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="Credit Card, PayPal, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        How you'll pay influencers (will be integrated with Stripe in production)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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