'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { HERITAGE_COLORS, NODE_COLORS } from '@/lib/theme';
import type { AncestorRecord } from '@/hooks/useMindMap';

type NodeType = AncestorRecord['type'];

const TYPE_ICONS: Record<NodeType, string> = {
  ancestor:   '👤',
  event:      '📜',
  monument:   '🏛️',
  temple:     '🕍',
  devasthan:  '🙏',
  chabutro:   '🕊️',
  panjrapole: '🐄',
};

const TYPE_LABELS: Record<NodeType, string> = {
  ancestor:   'Ancestor',
  event:      'Event',
  monument:   'Monument',
  temple:     'Temple',
  devasthan:  'Devasthan',
  chabutro:   'Chabutro',
  panjrapole: 'Panjrapole',
};

interface AncestorNodeData {
  label: string;
  role?:  string;
  type:   NodeType;
  bio?:   string;
}

const AncestorNode = memo(function AncestorNode({ data, selected }: NodeProps) {
  const d         = data as unknown as AncestorNodeData;
  const color     = NODE_COLORS[d.type] ?? HERITAGE_COLORS.stone;
  const icon      = TYPE_ICONS[d.type]  ?? '◆';
  const typeLabel = TYPE_LABELS[d.type] ?? d.type;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`
        relative rounded-xl flex flex-col gap-1.5 p-3
        bg-slate-mid border transition-all duration-200 cursor-default
        ${selected
          ? 'border-gold shadow-gold scale-105'
          : 'border-slate/50 hover:border-gold/50 hover:shadow-md'
        }
      `}
      style={{
        minWidth:   160,
        maxWidth:   200,
        borderLeftColor: color,
        borderLeftWidth: 3,
      }}
      role="listitem"
      aria-label={`${d.label}, ${typeLabel}${d.role ? `, ${d.role}` : ''}`}
    >
      {/* Type badge */}
      <div className="flex items-center gap-1.5">
        <span className="text-base" role="img" aria-hidden="true">{icon}</span>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}25`, color }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Name */}
      <p className="text-ivory text-sm font-semibold leading-snug font-display">
        {d.label}
      </p>

      {/* Role */}
      {d.role && (
        <p className="text-stone text-xs leading-snug truncate">{d.role}</p>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: color, border: 'none', width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: color, border: 'none', width: 6, height: 6 }}
      />
    </motion.div>
  );
});

export default AncestorNode;
