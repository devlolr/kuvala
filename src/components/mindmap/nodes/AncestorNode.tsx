'use client';

import { memo, useMemo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import { HeritageNode } from '@/hooks/useMindMap';

const AncestorNode = memo(function AncestorNode({ data, selected, id }: NodeProps<HeritageNode>) {
  const { lang } = useI18n();
  const d = data;
  
  // Use the name in the current language
  const name = useMemo(() => {
    return d.label[lang as keyof typeof d.label] || d.label.en;
  }, [d.label, lang]);

  const onExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    d.onToggle(id);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`
        relative rounded-xl flex flex-col gap-2 pt-4 pb-4 pr-4 min-h-[100px]
        bg-slate-mid border-2 transition-all duration-200 cursor-default
        ${selected
          ? 'border-gold shadow-gold scale-[1.02]'
          : 'border-slate/50 hover:border-gold/50 hover:shadow-md'
        }
      `}
      style={{
        width: 260, // Sligtly wider for more space
        paddingLeft: '2.25rem', // Added significant space before the first char
        borderLeftColor: '#C9982A',
        borderLeftWidth: d.isAlwaysVisible ? 6 : 4,
      }}
    >
      {/* Icon/Symbol and Toggle */}
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <div className="w-8 h-8 flex items-center justify-center opacity-80">
          <img 
            src={
              d.pad === 'Acharya' ? '/acharya.svg' :
              d.pad === 'Upadhaya' ? '/upadhaya.svg' :
              '/sadhu.svg'
            }
            alt={d.pad || 'Sadhu'}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Expansion Indicator */}
        {d.hasChildren && (
          <button
            onClick={onExpandToggle}
            className={`
              flex items-center justify-center w-7 h-7 rounded-full
              border border-gold/40 text-gold text-sm font-bold
              hover:bg-gold/10 transition-colors cursor-pointer
              ${d.expanded ? 'bg-gold/10 shadow-inner' : ''}
            `}
            aria-label={d.expanded ? 'Collapse' : 'Expand'}
          >
            {d.expanded ? '−' : '+'}
          </button>
        )}
      </div>

      {/* Name */}
      <h3 className="text-ivory text-base font-semibold leading-tight font-display break-words">
        {name}
      </h3>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#C9982A', border: 'none', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#C9982A', border: 'none', width: 10, height: 10 }}
      />
    </motion.div>
  );
});

export default AncestorNode;
