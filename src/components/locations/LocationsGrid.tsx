'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ANIMATION_PRESETS, LOCATION_CATEGORIES, type LocationCategory } from '@/lib/theme';
import { useI18n } from '@/i18n';

import { type HeritageLocation } from '@/lib/sanity/types';

const CATEGORY_ICONS: Record<string, string> = {
  temple:     '🕍',
  devasthan:  '🙏',
  chabutro:   '🕊️',
  panjrapole: '🐄',
  other:      '🏛️',
  all:        '✦',
};

/* ── Location Card ───────────────────────────────────────────── */
function LocationCard({ loc }: { loc: HeritageLocation }) {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      variants={ANIMATION_PRESETS.staggerItem}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="h-full"
    >
      <Link
        href={`/locations/${loc.slug}`}
        aria-label={`Visit ${loc.title}`}
        className="
          card-heritage block h-full group rounded-2xl
          flex flex-col
        "
      >
        {/* Top row: icon + year */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/15 transition-colors duration-300">
              <span className="text-xl" role="img" aria-hidden="true">
                {CATEGORY_ICONS[loc.category] ?? '🏛️'}
              </span>
            </div>
            {/* Category badge */}
            <span className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold capitalize">
              {loc.category}
            </span>
          </div>
          {loc.foundedYear && (
            <span className="text-stone text-xs mt-0.5 flex-shrink-0">Est. {loc.foundedYear}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-earth text-lg font-bold leading-snug mb-3 group-hover:text-terracotta transition-colors duration-200">
          {loc.title}
        </h3>

        {/* Excerpt */}
        {loc.excerpt && (
          <p className="text-stone text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
            {loc.excerpt}
          </p>
        )}

        {/* Explore link */}
        <div className="flex items-center gap-1.5 text-gold text-xs font-semibold mt-auto
          opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          Explore
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Locations Grid (Client) ─────────────────────────────────── */
export default function LocationsGrid({ locations }: { locations: HeritageLocation[] }) {
  const [activeCategory, setActiveCategory] = useState<LocationCategory | 'all'>('all');
  const { t } = useI18n();

  const filtered =
    activeCategory === 'all'
      ? locations
      : locations.filter(l => l.category === activeCategory);

  return (
    <div>
      {/* ── Category filter bar ── */}
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-3 mb-10"
      >
        {LOCATION_CATEGORIES.map(({ key, label }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              id={`filter-${key}`}
              onClick={() => setActiveCategory(key as LocationCategory | 'all')}
              aria-pressed={isActive}
              style={{ padding: '0.75rem 1.625rem' }}
              className={`
                inline-flex items-center gap-2 rounded-full text-sm font-semibold
                border transition-all duration-300
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
                ${isActive
                  ? 'bg-gold text-slate border-gold shadow-[0_4px_20px_rgba(201,152,42,0.35)]'
                  : 'bg-surface border-border text-stone hover:border-gold/50 hover:text-gold hover:bg-gold/5'
                }
              `}
            >
              <span className="text-base leading-none" aria-hidden="true">{CATEGORY_ICONS[key]}</span>
              <span>{(() => { const translated = t(`location.category.${key}`); return (translated && translated !== `location.category.${key}`) ? translated : label; })()}</span>
            </button>
          );
        })}
      </div>

      {/* ── Card grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={ANIMATION_PRESETS.staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          role="list"
          aria-label={`Heritage locations — ${activeCategory}`}
        >
          {filtered.map(loc => (
            <div key={loc._id} role="listitem" className="flex">
              <div className="w-full">
                <LocationCard loc={loc} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-stone text-base">No locations in this category yet.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
