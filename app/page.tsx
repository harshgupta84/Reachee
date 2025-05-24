import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32">
        <div className="container flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            Connect Brands and Influencers for Successful Collaborations
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
            Reachee is a powerful platform that connects brands with influencers to create authentic 
            partnerships that drive results.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link href="/register" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join as Influencer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300">
              <Link href="/register" className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Want to Sponsor?
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/campaigns" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                Browse Campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Our platform makes it easy to find and manage partnerships.
          </p>
          <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-bold">Create Your Profile</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Register and set up your brand or influencer profile with all the key details.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-bold">Connect and Collaborate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse campaigns or influencers and find the perfect match for your goals.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-bold">Grow Together</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Launch successful campaigns and track your results to maximize impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/50 py-16 md:py-24">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Join thousands of brands and influencers already collaborating on Reachee.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/register" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join as Influencer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100">
              <Link href="/register" className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Start Sponsoring
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
