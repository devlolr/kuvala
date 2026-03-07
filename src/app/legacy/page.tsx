import type { Metadata } from 'next';
import { Suspense } from 'react';
import HeritageMap from '@/components/mindmap/HeritageMap';
import mockData from '@/data/mockMindMap.json';
import type { AncestorRecord } from '@/hooks/useMindMap';

export const metadata: Metadata = {
  title: 'Legacy Mind-Map',
  description: "Explore 400+ years of Kuvala's ancestry, events, and monuments through an interactive heritage mind-map.",
};

export default function LegacyPage() {
  // In production: replace mockData with a Sanity fetch using ALL_ANCESTORS_QUERY
  const records = mockData as AncestorRecord[];

  return (
    <div className="flex flex-col" style={{ height: '100svh' }}>
      {/* Page header */}
      <div className="bg-slate border-b border-gold/20 pt-20 pb-4 px-4 md:px-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-1">
            Interactive Heritage
          </p>
          <h1 className="font-display text-ivory text-3xl-fluid font-bold">
            Legacy Mind-Map
          </h1>
          <p className="text-stone text-sm mt-1">
            Click an era to expand its records. Drag to pan · Scroll to zoom.
          </p>
        </div>
        <span className="hidden sm:block px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
          {records.filter(r => !r._id.startsWith('era-')).length} records
        </span>
      </div>

      {/* Full-height map canvas */}
      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-slate text-stone">
              Loading heritage map…
            </div>
          }
        >
          <HeritageMap records={records} />
        </Suspense>
      </div>
    </div>
  );
}
