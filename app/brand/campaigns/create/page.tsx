'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  budget: z.coerce.number().min(1, 'Budget must be at least 1'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
  platforms: z.string().min(2, 'Please enter at least one platform'),
  categories: z.string().min(2, 'Please enter at least one category'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      budget: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      platforms: '',
      categories: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Submit the data to API
    toast.promise(
      async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      },
      {
        loading: 'Creating campaign...',
        success: () => {
          router.push('/brand/campaigns');
          return 'Campaign created successfully!';
        },
        error: 'Failed to create campaign',
      }
    );
    
    // Set submitting to false after the promise completes
    setTimeout(() => setIsSubmitting(false), 1500);
  }

  return (
    <div className="container grid flex-1 items-center justify-center py-10 md:py-20">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Campaign</CardTitle>
          <CardDescription>
            Fill out the details for your influencer marketing campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Collection Promotion" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your campaign goals, products to promote, etc." 
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Influencer Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Minimum follower count, content type, deliverables, etc." 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Specify what you expect from influencers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="1000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Total campaign budget
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Last day for influencers to apply
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Platforms</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram, TikTok, YouTube, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple platforms with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Categories</FormLabel>
                      <FormControl>
                        <Input placeholder="Fashion, Beauty, Tech, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple categories with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 