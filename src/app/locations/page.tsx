import type { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { ALL_LOCATIONS_QUERY } from '@/lib/sanity/queries';
import LocationsGrid from '@/components/locations/LocationsGrid';
import { MOCK_LOCATIONS, type HeritageLocation } from '@/data/mockLocations';

export const metadata: Metadata = {
  title: 'Heritage Locations',
  description: 'Explore temples, devasthans, the Chabutro, and Panjrapole — the heritage institutions of Kuvala.',
};

export const revalidate = 3600;

export default async function LocationsPage() {
  const locations = await sanityFetch<HeritageLocation[]>(ALL_LOCATIONS_QUERY);
  const displayed = locations?.length > 0 ? locations : MOCK_LOCATIONS;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="gradient-mesh py-16 text-center">
        <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          Kuvala Heritage
        </p>
        <h1 className="font-display text-5xl-fluid font-bold text-ivory mb-4">
          Heritage Locations
        </h1>
        <p className="text-parchment/70 text-lg max-w-xl mx-auto">
          Temples, community institutions, and sacred spaces that define Kuvala.
        </p>
      </div>

      <div className="container-wide section-pad">
        <LocationsGrid locations={displayed} />
      </div>
    </div>
  );
}
