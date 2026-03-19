import type { Metadata } from 'next';
import LegacyMapContent from '@/components/mindmap/LegacyMapContent';
import { sanityFetch } from '@/lib/sanity/client';
import { ALL_ANCESTORS_QUERY } from '@/lib/sanity/queries';
import type { AncestorRecord } from '@/hooks/useMindMap';

export const metadata: Metadata = {
  title: 'Legacy Heritage Map',
  description: "Explore the 400+ years lineage and heritage of Kuvala through an interactive hierarchical mind-map.",
};

export default async function LegacyPage() {
  const records = await sanityFetch<AncestorRecord[]>(ALL_ANCESTORS_QUERY);

  if (!records || records.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate text-ivory">
        No heritage records found in archives.
      </div>
    );
  }

  return <LegacyMapContent records={records} />;
}
