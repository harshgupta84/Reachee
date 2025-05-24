'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Users, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['INFLUENCER', 'BRAND'], { message: 'Please select a role' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  // Name is required for influencers but optional for brands
  if (data.role === 'INFLUENCER') {
    return data.name && data.name.length >= 2;
  }
  return true;
}, {
  message: 'Name is required for influencers',
  path: ['name'],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'INFLUENCER' | 'BRAND' | null>(null);
  const router = useRouter();
  const { setUser, setAuthenticated } = useAuthStore();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const selectRole = (role: 'INFLUENCER' | 'BRAND') => {
    setSelectedRole(role);
    form.setValue('role', role);
  };

  const onSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setAuthenticated(true);
      
      toast.success('Account created successfully!');
      router.push(values.role === 'INFLUENCER' ? '/influencer/onboarding' : '/brand/onboarding');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating account');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Join Reachee</CardTitle>
          <CardDescription>Choose how you want to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedRole ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">How do you want to use Reachee?</h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 border-2 hover:border-primary"
                  onClick={() => selectRole('INFLUENCER')}
                >
                  <Users className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">I'm an Influencer</div>
                    <div className="text-sm text-muted-foreground">Create content and work with brands</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 border-2 hover:border-orange-500 text-orange-700 border-orange-200"
                  onClick={() => selectRole('BRAND')}
                >
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div className="text-center">
                    <div className="font-semibold text-orange-900">Want to Sponsor?</div>
                    <div className="text-sm text-orange-700">Find influencers for your brand</div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    {selectedRole === 'INFLUENCER' ? (
                      <>
                        <Users className="h-4 w-4" />
                        Signing up as Influencer
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-700">Signing up as Sponsor/Brand</span>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRole(null)}
                      className="ml-2 h-6 px-2 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                {selectedRole === 'INFLUENCER' && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Create a strong password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className={`w-full ${selectedRole === 'BRAND' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Creating account...' 
                    : selectedRole === 'BRAND' 
                      ? 'Create Sponsor Account' 
                      : 'Create Influencer Account'
                  }
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 