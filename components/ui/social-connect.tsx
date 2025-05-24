'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Instagram, Youtube, Twitter, Facebook, Plus, RefreshCw, ExternalLink, TrendingUp, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    placeholder: '@username',
    urlTemplate: 'https://instagram.com/',
    description: 'Connect your Instagram account to showcase your posts and stories',
    supportsOAuth: true,
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    placeholder: '@channel or channel URL',
    urlTemplate: 'https://youtube.com/@',
    description: 'Connect your YouTube channel to display your video content',
    supportsOAuth: true,
  },
  {
    name: 'TikTok',
    icon: () => <div className="h-5 w-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>,
    color: 'text-black',
    bgColor: 'bg-gray-50',
    placeholder: '@username',
    urlTemplate: 'https://tiktok.com/@',
    description: 'Connect your TikTok account to feature your short-form videos',
    supportsOAuth: false,
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    placeholder: '@username',
    urlTemplate: 'https://twitter.com/',
    description: 'Connect your Twitter/X account to show your tweets and engagement',
    supportsOAuth: false,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    placeholder: '@username or page URL',
    urlTemplate: 'https://facebook.com/',
    description: 'Connect your Facebook page to showcase your community',
    supportsOAuth: true,
  },
];

interface SocialPlatform {
  id: string;
  platform: string;
  username: string;
  url: string;
  followers: number;
  isVerified?: boolean;
  accessToken?: string;
  profileData?: any;
}

interface SocialConnectProps {
  connectedPlatforms: SocialPlatform[];
  onConnect: (platform: string, username: string, accessToken?: string, profileData?: any) => Promise<void>;
  onRefresh: (platformId: string) => Promise<void>;
  onDisconnect: (platformId: string) => Promise<void>;
}

export default function SocialConnect({ 
  connectedPlatforms, 
  onConnect, 
  onRefresh, 
  onDisconnect 
}: SocialConnectProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check for OAuth callback results
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle Instagram connection
    if (urlParams.get('instagram_connected') === 'true') {
      const accountData = urlParams.get('account_data');
      if (accountData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(accountData));
          handleOAuthSuccess('Instagram', parsed);
        } catch (error) {
          toast.error('Failed to process Instagram connection');
        }
      }
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard?tab=profile');
    }

    // Handle Facebook connection
    if (urlParams.get('facebook_connected') === 'true') {
      const accountData = urlParams.get('account_data');
      if (accountData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(accountData));
          handleOAuthSuccess('Facebook', parsed);
        } catch (error) {
          toast.error('Failed to process Facebook connection');
        }
      }
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard?tab=profile');
    }

    // Handle YouTube connection
    if (urlParams.get('youtube_connected') === 'true') {
      const accountData = urlParams.get('account_data');
      if (accountData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(accountData));
          handleOAuthSuccess('YouTube', parsed);
        } catch (error) {
          toast.error('Failed to process YouTube connection');
        }
      }
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard?tab=profile');
    }

    // Handle errors
    const error = urlParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard?tab=profile');
    }
  }, []);

  const handleOAuthSuccess = async (platform: string, accountData: any) => {
    try {
      await onConnect(
        platform, 
        accountData.username, 
        accountData.accessToken, 
        {
          ...accountData.profileData,
          followerCount: accountData.followerCount,
          userId: accountData.userId
        }
      );
      toast.success(`${platform} connected successfully!`);
    } catch (error) {
      toast.error(`Failed to save ${platform} connection`);
    }
  };

  const handleOAuthConnect = async (platform: string) => {
    try {
      setIsConnecting(platform);
      
      // Get OAuth URL from our API
      const response = await fetch(`/api/social/validate?platform=${platform.toLowerCase()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authorization URL');
      }
      
      // Redirect to OAuth provider
      window.location.href = data.authUrl;
      
    } catch (error) {
      toast.error(`Failed to start ${platform} authorization`);
      setIsConnecting(null);
    }
  };

  const handleManualConnect = async () => {
    if (!selectedPlatform || !username) return;
    
    setIsValidating(true);
    setValidationError(null);
    setIsConnecting(selectedPlatform.name);
    
    try {
      // For platforms that support OAuth, try validation first
      if (selectedPlatform.supportsOAuth) {
        const response = await fetch('/api/social/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: selectedPlatform.name,
            username: username,
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          if (data.authUrl) {
            // OAuth required
            setValidationError('This platform requires authentication. Please use the "Connect with OAuth" button.');
            setIsValidating(false);
            setIsConnecting(null);
            return;
          } else {
            throw new Error(data.error || 'Validation failed');
          }
        }

        // If validation successful with token, use the validated account
        if (data.account) {
          await onConnect(
            selectedPlatform.name, 
            data.account.username, 
            data.account.accessToken,
            data.account.profileData
          );
          toast.success(`${selectedPlatform.name} connected and verified!`);
        }
      } else {
        // For platforms without OAuth, do basic validation and manual entry
        await onConnect(selectedPlatform.name, username);
        toast.success(`${selectedPlatform.name} connected! (Manual entry - verification pending)`);
      }
      
      setUsername('');
      setSelectedPlatform(null);
      setDialogOpen(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setValidationError(errorMessage);
      toast.error(`Failed to connect to ${selectedPlatform.name}: ${errorMessage}`);
    } finally {
      setIsValidating(false);
      setIsConnecting(null);
    }
  };

  const handleRefresh = async (platform: SocialPlatform) => {
    setIsRefreshing(platform.id);
    try {
      await onRefresh(platform.id);
      toast.success(`${platform.platform} data refreshed!`);
    } catch (error) {
      toast.error(`Failed to refresh ${platform.platform} data`);
    } finally {
      setIsRefreshing(null);
    }
  };

  const getConnectedPlatform = (platformName: string) => {
    return connectedPlatforms.find(p => p.platform === platformName);
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Social Media Accounts</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Social Media</DialogTitle>
              <DialogDescription>
                Choose a platform to connect to your profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const isConnected = getConnectedPlatform(platform.name);
                
                return (
                  <Card 
                    key={platform.name} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlatform?.name === platform.name ? 'ring-2 ring-primary' : ''
                    } ${isConnected ? 'opacity-50' : ''}`}
                    onClick={() => !isConnected && setSelectedPlatform(platform)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${platform.bgColor}`}>
                          <Icon className={`h-5 w-5 ${platform.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{platform.name}</h4>
                            {platform.supportsOAuth && (
                              <span title="Secure OAuth Available">
                                <Shield className="h-4 w-4 text-green-600" />
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                        </div>
                        {isConnected && (
                          <Badge variant="secondary">Connected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {selectedPlatform && (
                <div className="space-y-4 pt-4 border-t">
                  {validationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-2">
                    {selectedPlatform.supportsOAuth && (
                      <Button 
                        onClick={() => handleOAuthConnect(selectedPlatform.name)}
                        disabled={isConnecting === selectedPlatform.name}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {isConnecting === selectedPlatform.name ? 'Connecting...' : 'Connect with OAuth'}
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      {selectedPlatform.supportsOAuth ? 'Or enter manually:' : 'Username/Handle'}
                    </Label>
                    <Input
                      id="username"
                      placeholder={selectedPlatform.placeholder}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setValidationError(null);
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleManualConnect}
                      disabled={!username || isValidating || isConnecting === selectedPlatform.name}
                      className="flex-1"
                    >
                      {isValidating ? 'Validating...' : selectedPlatform.supportsOAuth ? 'Add Manually' : 'Connect'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPlatform(null);
                        setUsername('');
                        setValidationError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {connectedPlatforms.map((platform) => {
          const platformConfig = socialPlatforms.find(p => p.name === platform.platform);
          const Icon = platformConfig?.icon || Instagram;
          const hasRealData = platform.accessToken && platform.profileData;
          
          return (
            <Card key={platform.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${platformConfig?.bgColor || 'bg-gray-50'}`}>
                      <Icon className={`h-5 w-5 ${platformConfig?.color || 'text-gray-500'}`} />
                    </div>
                    <CardTitle className="text-base">{platform.platform}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasRealData ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">@{platform.username}</p>
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Followers</span>
                  </div>
                  <span className="font-bold text-lg">{formatFollowerCount(platform.followers)}</span>
                </div>
                
                {hasRealData && platform.profileData && (
                  <div className="text-xs text-gray-600 space-y-1">
                    {platform.profileData.accountType && (
                      <div>Type: {platform.profileData.accountType}</div>
                    )}
                    {platform.profileData.mediaCount && (
                      <div>Posts: {platform.profileData.mediaCount}</div>
                    )}
                    {platform.profileData.category && (
                      <div>Category: {platform.profileData.category}</div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefresh(platform)}
                    disabled={isRefreshing === platform.id}
                    className="flex-1"
                  >
                    {isRefreshing === platform.id ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1" />
                    )}
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDisconnect(platform.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {connectedPlatforms.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg">No Social Media Connected</h3>
                <p className="text-muted-foreground">
                  Connect your social media accounts to showcase your reach and engagement to brands.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 