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

import { useMindMap } from '@/hooks/useMindMap';
import { type AncestorRecord } from '@/lib/sanity/types';
import AncestorNode from '@/components/mindmap/nodes/AncestorNode';
import { useI18n } from '@/i18n';

/* ── Custom node types registry ─────────────────────────────── */
const nodeTypes: NodeTypes = {
  ancestorNode: AncestorNode,
};

/* ── Map Controls Component ─────────────────────────────────── */
function MapToolbar({ collapseAll }: { collapseAll: () => void }) {
  const { fitView } = useReactFlow();
  const { t } = useI18n();

  return (
    <div className="absolute bottom-16 right-4 z-10 flex flex-col gap-2">
      {/* Fit View */}
      <button
        id="mindmap-fit-view"
        onClick={() => fitView({ padding: 0.1, duration: 600 })}
        className="
          px-4 py-2 rounded-lg
          glass-dark border border-gold/30 text-gold text-sm font-semibold
          hover:bg-gold/10 active:scale-95
          transition-all duration-200 shadow-md
        "
      >
        ⊞ {t('map.fitView')}
      </button>

      {/* Collapse All */}
      <button
        id="mindmap-collapse-all"
        onClick={collapseAll}
        className="
          px-4 py-2 rounded-lg
          glass-dark border border-gold/30 text-gold text-sm font-semibold
          hover:bg-gold/10 active:scale-95
          transition-all duration-200 shadow-md
        "
      >
        − {t('map.collapseAll') || 'Collapse All'}
      </button>
    </div>
  );
}

/* ── Inner map (needs ReactFlowProvider context) ─────────────── */
function HeritageMapInner({ records }: { records: AncestorRecord[] }) {
  const { t } = useI18n();
  const { nodes, edges, toggleNode, collapseAll } = useMindMap(records);
  const { fitView } = useReactFlow();

  // Re-fit view whenever the layout changes (hierarchy expand / collapse)
  useEffect(() => {
    const id = setTimeout(() => fitView({ padding: 0.15, duration: 450 }), 50);
    return () => clearTimeout(id);
  }, [nodes, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string; data: any }) => {
      if (node.data?.hasChildren) {
        toggleNode(node.id);
      }
    },
    [toggleNode],
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
        minZoom={0.05}
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
          position="bottom-left"
          style={{
            background: 'var(--color-slate-mid)',
            border: '1px solid rgba(201, 152, 42, 0.3)',
            borderRadius: '0.75rem',
          }}
          nodeColor={(node) => {
            return (node.data as any).isAlwaysVisible ? '#C4622D' : '#6B3F1F';
          }}
          maskColor="rgba(28, 35, 51, 0.8)"
        />

        <Controls
          position="top-right"
          showInteractive={false}
          aria-label="Map controls"
        />

        <MapToolbar collapseAll={collapseAll} />
      </ReactFlow>
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
