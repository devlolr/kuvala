import { Suspense } from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import QuickStats from '@/components/home/QuickStats';
import FeaturedLegacy from '@/components/home/FeaturedLegacy';
import { sanityFetch } from '@/lib/sanity/client';
import { FEATURED_MONUMENTS_QUERY, SITE_STATS_QUERY } from '@/lib/sanity/queries';
import type { Monument } from '@/components/home/FeaturedLegacy';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Kuvala — discover 400+ years of heritage, temples, ancestors, and living traditions.',
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  // Fetches from Sanity CDN (gracefully returns null/[] if unconfigured)
  const [monuments, stats] = await Promise.all([
    sanityFetch<Monument[]>(FEATURED_MONUMENTS_QUERY),
    sanityFetch<any>(SITE_STATS_QUERY)
  ]);

  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="section-pad-sm" />}>
        <QuickStats initialStats={stats} />
      </Suspense>
      <Suspense fallback={<div className="section-pad text-center text-stone">Loading heritage…</div>}>
        <FeaturedLegacy monuments={monuments} />
      </Suspense>
    </>
  );
}
