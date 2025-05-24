'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Edit, Save, X, Camera, Instagram, Youtube, DollarSign, MapPin, Building2, Users, Globe, Twitter, Facebook, BarChart3, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/useAuthStore';
import SocialConnect from '@/components/ui/social-connect';
import AnalyticsDashboard from '@/components/dashboard/analytics-dashboard';

// Schemas for different profile types
const influencerProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  location: z.string().min(2, 'Please enter your location'),
  contentCategories: z.string().min(2, 'Please enter your content categories'),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  facebookHandle: z.string().optional(),
  minimumRate: z.string().min(1, 'Please enter a minimum rate'),
  preferredContentTypes: z.string().min(2, 'Please enter preferred content types'),
});

const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Please enter your industry'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preferredRegions: z.string().min(2, 'Please enter preferred regions'),
  preferredCategories: z.string().min(2, 'Please enter preferred categories'),
  budget: z.string().optional(),
});

type InfluencerFormValues = z.infer<typeof influencerProfileSchema>;
type BrandFormValues = z.infer<typeof brandProfileSchema>;

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, setLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && (tabParam === 'profile' || tabParam === 'analytics')) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/login');
    }
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
        if (!isAuthenticated) {
          redirect('/login');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, setLoading]);

  useEffect(() => {
    // Fetch complete profile data
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  const influencerForm = useForm<InfluencerFormValues>({
    resolver: zodResolver(influencerProfileSchema),
    defaultValues: {
      bio: '',
      location: '',
      contentCategories: '',
      instagramHandle: '',
      tiktokHandle: '',
      youtubeHandle: '',
      twitterHandle: '',
      facebookHandle: '',
      minimumRate: '',
      preferredContentTypes: '',
    },
  });

  const brandForm = useForm<BrandFormValues>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      website: '',
      description: '',
      preferredRegions: '',
      preferredCategories: '',
      budget: '',
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData && user?.role === 'INFLUENCER' && profileData.influencerProfile) {
      const profile = profileData.influencerProfile;
      influencerForm.reset({
        bio: profile.bio || '',
        location: profile.location || '',
        contentCategories: profile.categories?.join(', ') || '',
        instagramHandle: profile.socialPlatforms?.find((p: any) => p.platform === 'Instagram')?.username || '',
        tiktokHandle: profile.socialPlatforms?.find((p: any) => p.platform === 'TikTok')?.username || '',
        youtubeHandle: profile.socialPlatforms?.find((p: any) => p.platform === 'YouTube')?.username || '',
        twitterHandle: profile.socialPlatforms?.find((p: any) => p.platform === 'Twitter')?.username || '',
        facebookHandle: profile.socialPlatforms?.find((p: any) => p.platform === 'Facebook')?.username || '',
        minimumRate: '100', // Default if not set
        preferredContentTypes: profile.metrics?.contentCategories?.join(', ') || '',
      });
    } else if (profileData && user?.role === 'BRAND' && profileData.brandProfile) {
      const profile = profileData.brandProfile;
      brandForm.reset({
        companyName: profile.companyName || '',
        industry: profile.industry || '',
        website: profile.website || '',
        description: profile.description || '',
        preferredRegions: 'Global', // Default
        preferredCategories: 'All Categories', // Default
        budget: '',
      });
    }
  }, [profileData, user?.role, influencerForm, brandForm]);

  const onInfluencerSubmit = async (values: InfluencerFormValues) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          type: 'INFLUENCER',
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // Refresh profile data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSocialConnect = async (platform: string, username: string, accessToken?: string, profileData?: any) => {
    try {
      const response = await fetch('/api/profile/social/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          platform,
          username,
          accessToken,
          followerCount: profileData?.followerCount || 0,
          profileData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect platform');
      }

      // Refresh profile data
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  const handleSocialRefresh = async (platformId: string) => {
    // TODO: Implement real social media API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSocialDisconnect = async (platformId: string) => {
    try {
      const response = await fetch('/api/profile/social/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platformId }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect platform');
      }

      // Refresh profile data
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  const onBrandSubmit = async (values: BrandFormValues) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          type: 'BRAND',
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // Refresh profile data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="container py-10">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name || (user.role === 'BRAND' ? 'Brand User' : 'Influencer')}!
          </h1>
          <p className="text-muted-foreground">
            {user.role === 'INFLUENCER' 
              ? 'Manage your influencer profile and discover new opportunities' 
              : 'Manage your brand profile and find the perfect influencers'
            }
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          {user.role === 'INFLUENCER' && (
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {user.role === 'INFLUENCER' ? (
            <InfluencerDashboard 
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              form={influencerForm}
              onSubmit={onInfluencerSubmit}
              profileData={profileData}
              onSocialConnect={handleSocialConnect}
              onSocialRefresh={handleSocialRefresh}
              onSocialDisconnect={handleSocialDisconnect}
            />
          ) : (
            <BrandDashboard 
              isEditing={isEditing}
              form={brandForm}
              onSubmit={onBrandSubmit}
              profileData={profileData}
            />
          )}
        </TabsContent>

        {user.role === 'INFLUENCER' && (
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard 
              profileData={profileData} 
              onNavigateToProfile={() => setActiveTab('profile')}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function InfluencerDashboard({ isEditing, setIsEditing, form, onSubmit, profileData, onSocialConnect, onSocialRefresh, onSocialDisconnect }: any) {
  if (!isEditing) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Bio</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.influencerProfile?.bio || 'No bio added yet'}
              </p>
            </div>
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.influencerProfile?.location || 'No location added'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Content Categories</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.influencerProfile?.categories?.join(', ') || 'No categories added'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Rates & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Minimum Rate</h4>
              <p className="text-sm text-muted-foreground">$100 per post</p>
            </div>
            <div>
              <h4 className="font-medium">Content Types</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.influencerProfile?.metrics?.contentCategories?.join(', ') || 'Posts, Stories, Reels'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Social Media Accounts
            </CardTitle>
            <CardDescription>
              Manage your social media presence and track performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialConnect
              connectedPlatforms={profileData?.influencerProfile?.socialPlatforms || []}
              onConnect={onSocialConnect}
              onRefresh={onSocialRefresh}
              onDisconnect={onSocialDisconnect}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
        <CardDescription>Update your influencer profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell brands about yourself" className="min-h-20" {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Rate (USD)</FormLabel>
                    <FormControl>
                      <Input placeholder="100" type="number" {...field} />
                    </FormControl>
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
                      <Input placeholder="Fashion, Beauty, Tech" {...field} />
                    </FormControl>
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
                      <Input placeholder="Posts, Stories, Reels" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagramHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
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
                    <FormLabel>TikTok Handle</FormLabel>
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
                      <Input placeholder="Channel URL or @handle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebookHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function BrandDashboard({ isEditing, form, onSubmit, profileData }: any) {
  if (!isEditing) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Company Name</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.brandProfile?.companyName || 'No company name added'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Industry</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.brandProfile?.industry || 'No industry specified'}
              </p>
            </div>
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.brandProfile?.website || 'No website added'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">
                {profileData?.brandProfile?.description || 'No description added'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Campaign Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Target Regions</h4>
              <p className="text-sm text-muted-foreground">Global</p>
            </div>
            <div>
              <h4 className="font-medium">Content Categories</h4>
              <p className="text-sm text-muted-foreground">All Categories</p>
            </div>
            <div>
              <h4 className="font-medium">Budget Range</h4>
              <p className="text-sm text-muted-foreground">$500 - $5,000</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
        <CardDescription>Update your brand profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
                      <Input placeholder="Technology, Fashion, etc." {...field} />
                    </FormControl>
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

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget (USD)</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell influencers about your company" className="min-h-20" {...field} />
                    </FormControl>
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
                      <Input placeholder="North America, Europe, Global" {...field} />
                    </FormControl>
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
                      <Input placeholder="Fashion, Tech, Lifestyle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 