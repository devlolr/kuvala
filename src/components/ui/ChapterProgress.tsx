'use client';

/**
 * ChapterProgress — Right-edge floating scene indicator
 *
 * Shows the user where they are inside a multi-scene scroll-driven section.
 * Each dot represents one scene. The active dot glows gold and scales up.
 * Also shows a compact "Scene X / N" label that auto-hides when not hovered.
 *
 * Usage:
 *   <ChapterProgress
 *     total={6}
 *     currentIndex={activeScene}   // 0-based
 *     label="Scene"                // or t('history.phase')
 *   />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ChapterProgressProps {
  total: number;
  currentIndex: number;
  label?: string;
  className?: string;
}

export default function ChapterProgress({
  total,
  currentIndex,
  label = 'Scene',
  className = '',
}: ChapterProgressProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`fixed right-5 top-1/2 -translate-y-1/2 z-[70] flex flex-col items-end gap-2.5 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Scene label — appears on hover or always on mobile */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="text-[10px] text-gold/80 font-semibold tracking-[0.15em] uppercase mb-1 whitespace-nowrap"
          >
            {label} {currentIndex + 1} / {total}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex flex-col items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === currentIndex;
          const isPast   = i < currentIndex;

          return (
            <motion.div
              key={i}
              animate={{
                height:          isActive ? 28 : isPast ? 6 : 6,
                width:           isActive ? 4  : 4,
                backgroundColor: isActive
                  ? 'rgba(212,175,55,1)'
                  : isPast
                    ? 'rgba(212,175,55,0.50)'
                    : 'rgba(212,175,55,0.20)',
                boxShadow: isActive
                  ? '0 0 8px rgba(212,175,55,0.8)'
                  : 'none',
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-full"
              aria-label={`${label} ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
