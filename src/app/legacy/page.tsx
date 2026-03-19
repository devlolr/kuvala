import type { Metadata } from 'next';
import LegacyMapContent from '@/components/mindmap/LegacyMapContent';
import mockData from '@/data/mockMindMap.json';
import type { AncestorRecord } from '@/hooks/useMindMap';

export const metadata: Metadata = {
  title: 'Legacy Heritage Map',
  description: "Explore the 400+ years lineage and heritage of Kuvala through an interactive hierarchical mind-map.",
};

export default function LegacyPage() {
  const records = mockData as unknown as AncestorRecord[];

  return <LegacyMapContent records={records} />;
}
