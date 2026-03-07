'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';

interface EraGroupData {
  label:    string;
  type:     'era';
  count:    number;
  expanded: boolean;
}

const EraGroupNode = memo(function EraGroupNode({ data, selected }: NodeProps) {
  const d = data as unknown as EraGroupData;

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        relative rounded-2xl flex flex-col items-center justify-center gap-1
        px-5 py-3 cursor-pointer select-none
        border-2 transition-all duration-200
        ${selected
          ? 'border-gold shadow-gold bg-earth/90'
          : 'border-terracotta/70 bg-earth/80 hover:bg-earth hover:border-gold hover:shadow-gold'
        }
      `}
      style={{ minWidth: 200, minHeight: 70 }}
      role="button"
      aria-label={`${d.label} era — ${d.expanded ? 'collapse' : 'expand'} ${d.count} records`}
      aria-expanded={d.expanded}
    >
      {/* Era icon */}
      <span className="text-xl" role="img" aria-hidden="true">⏳</span>

      {/* Era label */}
      <p className="font-display text-ivory font-bold text-sm text-center leading-snug">
        {d.label}
      </p>

      {/* Badge: record count + expand state */}
      <div className="flex items-center gap-2 mt-0.5">
        <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-semibold">
          {d.count} records
        </span>
        <span className="text-gold/80 text-xs">
          {d.expanded ? '▲ Collapse' : '▼ Expand'}
        </span>
      </div>

      {/* Shimmer border for selected state */}
      {selected && (
        <motion.span
          layoutId={`era-glow-${d.label}`}
          className="absolute inset-0 rounded-2xl border-shimmer pointer-events-none"
        />
      )}

      {/* React Flow handles — hidden but required for edges */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'var(--color-gold)', border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'var(--color-gold)', border: 'none', width: 8, height: 8 }}
      />
    </motion.div>
  );
});

export default EraGroupNode;
