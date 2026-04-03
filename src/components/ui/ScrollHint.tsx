'use client';

/**
 * ScrollHint — Heritage scroll guidance component
 *
 * A beautiful, non-intrusive overlay hint that:
 *   1. Appears when a scroll-driven section enters the viewport
 *   2. Explains the scroll mechanic in context (vertical story / horizontal scene)
 *   3. Auto-dismisses after the timeout or on user tap/click
 *   4. Renders in both EN and GU based on active language
 *
 * Supported modes:
 *   "vertical"    → "Scroll slowly to experience the story"
 *   "horizontal"  → "Keep scrolling ↓ to journey through each scene"
 *   "peacock"     → "Scroll gently to witness the miracle"
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollHint, ScrollHintMode } from '@/hooks/useScrollHint';
import { useI18n, useLanguageToggle } from '@/i18n';

interface ScrollHintProps {
  /** Target ref to observe — hint triggers when this enters view */
  observeRef: React.RefObject<HTMLElement | null>;
  mode?: ScrollHintMode;
  /** Unique key to prevent re-showing (stored in session/localStorage) */
  hintKey: string;
  /** Position override — default is bottom-center */
  position?: 'bottom-center' | 'bottom-right' | 'center-right';
  /** Custom duration override in ms */
  duration?: number;
}

const HINT_CONTENT: Record<ScrollHintMode, { icon: string; en: string; gu: string }> = {
  vertical: {
    icon: '↓',
    en: 'Scroll slowly to experience the story',
    gu: 'વાર્તા અનુભવવા ધીરે ધીરે સ્ક્રોલ કરો',
  },
  horizontal: {
    icon: '↕',
    en: 'Keep scrolling ↓ to journey through each scene',
    gu: 'દરેક દ્રશ્ય અનુભવવા ↓ સ્ક્રોલ કરતા રહો',
  },
  peacock: {
    icon: '🦚',
    en: 'Scroll gently to witness the divine miracle',
    gu: 'અલૌકિક ચમત્કાર જોવા ધીમેથી સ્ક્રોલ કરો',
  },
};

const positionClasses: Record<NonNullable<ScrollHintProps['position']>, string> = {
  'bottom-center': 'bottom-10 left-1/2 -translate-x-1/2',
  'bottom-right':  'bottom-10 right-6',
  'center-right':  'top-1/2 right-6 -translate-y-1/2',
};

export default function ScrollHint({
  observeRef,
  mode = 'vertical',
  hintKey,
  position = 'bottom-center',
  duration = 4500,
}: ScrollHintProps) {
  const { visible, trigger, dismiss } = useScrollHint({ key: hintKey, duration, persist: false });
  const { isGujarati } = useLanguageToggle();
  const content = HINT_CONTENT[mode];

  /* Observe target element entering the viewport */
  useEffect(() => {
    const el = observeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trigger();
          observer.disconnect(); // only trigger once per mount
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeRef, trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-hint"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={dismiss}
          className={`
            fixed z-[80] ${positionClasses[position]}
            flex items-center gap-3
            px-5 py-3 rounded-2xl
            bg-black/70 backdrop-blur-xl
            border border-gold/30
            shadow-[0_0_30px_rgba(212,175,55,0.15)]
            cursor-pointer select-none
            pointer-events-auto
          `}
          role="status"
          aria-live="polite"
        >
          {/* Animated scroll icon */}
          <div className="relative w-7 h-7 flex-shrink-0">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center text-lg"
            >
              {mode === 'peacock' ? '🦚' : (
                <svg
                  width="20" height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gold"
                >
                  {mode === 'horizontal' ? (
                    /* ↕ bidirectional arrows for "scroll vertically, content moves horizontally" */
                    <path d="M12 5v14M9 16l3 3 3-3M9 8L12 5l3 3" />
                  ) : (
                    /* ↓ simple down scroll cue */
                    <path d="M12 5v14M9 16l3 3 3-3" />
                  )}
                </svg>
              )}
            </motion.div>
          </div>

          {/* Text */}
          <span className={`text-white/90 text-sm font-medium ${isGujarati ? 'font-gujarati leading-snug' : ''}`}>
            {isGujarati ? content.gu : content.en}
          </span>

          {/* Auto-dismiss progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gold/60 rounded-b-2xl origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />

          {/* Tap to dismiss hint */}
          <span className="text-white/30 text-xs ml-1 hidden sm:block">tap to dismiss</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
