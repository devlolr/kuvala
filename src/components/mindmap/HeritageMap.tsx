'use client';

import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  useReactFlow,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useMindMap, type AncestorRecord } from '@/hooks/useMindMap';
import EraGroupNode from '@/components/mindmap/nodes/EraGroupNode';
import AncestorNode from '@/components/mindmap/nodes/AncestorNode';
import { useI18n } from '@/i18n';

/* ── Custom node types registry ─────────────────────────────── */
const nodeTypes: NodeTypes = {
  eraGroup:     EraGroupNode,
  ancestorNode: AncestorNode,
};

/* ── Fit View Button ─────────────────────────────────────────── */
function FitViewButton() {
  const { fitView } = useReactFlow();
  const { t } = useI18n();

  return (
    <button
      id="mindmap-fit-view"
      onClick={() => fitView({ padding: 0.1, duration: 600 })}
      aria-label={t('map.fitView')}
      className="
        absolute bottom-16 right-4 z-10
        px-4 py-2 rounded-lg
        glass-dark border border-gold/30 text-gold text-sm font-semibold
        hover:bg-gold/10 active:scale-95
        transition-all duration-200 shadow-md
      "
    >
      ⊞ {t('map.fitView')}
    </button>
  );
}

/* ── Inner map (needs ReactFlowProvider context) ─────────────── */
function HeritageMapInner({ records }: { records: AncestorRecord[] }) {
  const { t } = useI18n();
  const { nodes, edges, toggleGroup } = useMindMap(records);
  const { fitView } = useReactFlow();

  // Re-fit view whenever the layout changes (era expand / collapse)
  useEffect(() => {
    const id = setTimeout(() => fitView({ padding: 0.15, duration: 450 }), 50);
    return () => clearTimeout(id);
  }, [nodes, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string; data: { type?: string } }) => {
      if (node.data.type === 'era') {
        toggleGroup(node.id);
      }
    },
    [toggleGroup],
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
        className="heritage-flow"
        aria-label="Kuvala Heritage Mind-Map"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(201, 152, 42, 0.15)"
        />

        <MiniMap
          position="bottom-right"
          style={{
            background: 'var(--color-slate-mid)',
            border: '1px solid rgba(201, 152, 42, 0.3)',
            borderRadius: '0.75rem',
          }}
          nodeColor={(node) => {
            const type = (node.data as Record<string, unknown>)?.type as string;
            const colorMap: Record<string, string> = {
              era:        '#C4622D',
              ancestor:   '#6B3F1F',
              event:      '#C9982A',
              monument:   '#4A5E3A',
              temple:     '#4A5E3A',
              devasthan:  '#8B5A35',
              chabutro:   '#E4B84A',
              panjrapole: '#4A5E3A',
            };
            return colorMap[type] ?? '#8A8A7A';
          }}
          maskColor="rgba(28, 35, 51, 0.8)"
        />

        <Controls
          position="top-right"
          showInteractive={false}
          aria-label="Map controls"
        />

        <FitViewButton />
      </ReactFlow>

      {/* Legend */}
      <div
        aria-label="Map legend"
        className="absolute top-4 left-4 z-10 glass-dark rounded-xl p-3 flex flex-col gap-2"
      >
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">{t('map.fitView')}</p>
        {[
          { color: '#C4622D', label: 'Era' },
          { color: '#6B3F1F', label: 'Ancestor' },
          { color: '#C9982A', label: 'Event' },
          { color: '#4A5E3A', label: 'Monument' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-parchment/70 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Public Component ────────────────────────────────────────── */
export default function HeritageMap({ records }: { records: AncestorRecord[] }) {
  return (
    <ReactFlowProvider>
      <HeritageMapInner records={records} />
    </ReactFlowProvider>
  );
}
