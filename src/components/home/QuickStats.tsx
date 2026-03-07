'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useI18n } from '@/i18n';
import { ANIMATION_PRESETS } from '@/lib/theme';

/* ── Animated Number Counter ────────────────────────────────── */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, { stiffness: 60, damping: 14 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionVal.set(value);
    const unsub = spring.on('change', v => setDisplay(Math.round(v)));
    return unsub;
  }, [value, motionVal, spring]);

  return (
    <span aria-label={`${value}${suffix}`}>
      {display.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

/* ── Stat Card ──────────────────────────────────────────────── */
interface StatCard {
  key:      string;
  value:    number;
  suffix?:  string;
  icon:     string;
  gradient: string;
}

const STATS: StatCard[] = [
  {
    key:      'stats.monuments',
    value:    12,
    icon:     '🏛️',
    gradient: 'from-earth to-terracotta',
  },
  {
    key:      'stats.history',
    value:    400,
    suffix:   '+',
    icon:     '📜',
    gradient: 'from-gold to-earth',
  },
  {
    key:      'stats.ancestors',
    value:    200,
    suffix:   '+',
    icon:     '🧬',
    gradient: 'from-moss to-earth',
  },
  {
    key:      'stats.events',
    value:    24,
    suffix:   '+',
    icon:     '🎉',
    gradient: 'from-terracotta to-gold',
  },
];

export default function QuickStats() {
  const ref     = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const { t }   = useI18n();

  return (
    <section
      ref={ref}
      aria-label="Heritage quick statistics"
      className="section-pad-sm bg-surface-raised relative"
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="container-wide">
        <motion.div
          variants={ANIMATION_PRESETS.staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.key}
              variants={ANIMATION_PRESETS.staggerItem}
              className="card-heritage p-6 text-center flex flex-col items-center gap-3 group cursor-default"
            >
              {/* Icon */}
              <span className="text-3xl" role="img" aria-hidden="true">
                {stat.icon}
              </span>

              {/* Number */}
              <p className="font-display text-4xl-fluid font-bold text-earth leading-none">
                {isInView ? (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span aria-hidden>0</span>
                )}
              </p>

              {/* Label */}
              <p className="text-stone text-sm font-medium tracking-wide uppercase">
                {t(stat.key)}
              </p>

              {/* Hover gradient bar */}
              <div
                className={`h-0.5 w-0 group-hover:w-3/4 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
