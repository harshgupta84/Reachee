'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Reachee</span>
              </Link>
              <nav className="hidden gap-6 md:flex">
                <Link
                  href="/campaigns"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/campaigns') ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Campaigns
                </Link>
                <Link
                  href="/influencers"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/influencers') ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Influencers
                </Link>
                <Link
                  href="/brands"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/brands') ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Brands
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/messages">Messages</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Reachee. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 