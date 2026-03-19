'use client';

import { Suspense } from 'react';
import { useI18n } from '@/i18n';
import HeritageMap from '@/components/mindmap/HeritageMap';
import type { AncestorRecord } from '@/hooks/useMindMap';

export default function LegacyMapContent({ records }: { records: AncestorRecord[] }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col" style={{ height: '100svh' }}>
      {/* Page header */}
      <div className="bg-slate border-b border-gold/20 pt-6 pb-4 px-4 md:px-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-1">
            {t('hero.tagline')} • {t('nav.legacy')}
          </p>
          <h1 className="font-display text-ivory text-3xl-fluid font-bold">
            {t('nav.legacy')}
          </h1>
          <p className="text-stone text-sm mt-1">
            Explore the lineage of Kuvala. Click nodes with (+) to expand generations. Drag to pan · Scroll to zoom.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            {records.length} {t('stats.ancestors')}
          </span>
        </div>
      </div>

      {/* Full-height map canvas */}
      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-slate text-stone">
              {t('map.loading')}
            </div>
          }
        >
          <HeritageMap records={records} />
        </Suspense>
      </div>
    </div>
  );
}
