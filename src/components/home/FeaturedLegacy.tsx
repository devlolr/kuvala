'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/i18n';
import { ANIMATION_PRESETS } from '@/lib/theme';

/* ── Types ─────────────────────────────────────────────────── */
export interface Monument {
  _id:         string;
  title:       string;
  slug:        { current: string };
  period:      string;
  image?:      string;
  blurDataURL?: string;
  description?: Array<{ children: Array<{ text: string }> }>;
}

/* ── Mock data (shown when Sanity isn't configured) ─────────── */
const MOCK_MONUMENTS: Monument[] = [
  {
    _id:    'mock-1',
    title:  'Ancient Shiva Temple',
    slug:   { current: 'shiva-temple' },
    period: '17th Century',
    image:  undefined,
    description: [{ children: [{ text: 'The oldest and most revered temple in Kuvala, dedicated to Lord Shiva. Built over 400 years ago, it stands as a testament to the village\'s deep spiritual roots.' }] }],
  },
  {
    _id:    'mock-2',
    title:  'Chabutro Bird Tower',
    slug:   { current: 'chabutro' },
    period: '19th Century',
    image:  undefined,
    description: [{ children: [{ text: 'A beautifully ornate feeding tower, built in service of birds. A symbol of Kuvala\'s reverence for all living beings.' }] }],
  },
  {
    _id:    'mock-3',
    title:  'Devasthan Complex',
    slug:   { current: 'devasthan-1' },
    period: 'Early Modern',
    image:  undefined,
    description: [{ children: [{ text: 'The community religious complex that serves as the spiritual heart of present-day Kuvala.' }] }],
  },
];

/* ── Placeholder image component ────────────────────────────── */
function MonumentImageFallback({ title, period }: { title: string; period: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-earth/20 to-terracotta/10">
      <span className="text-5xl" role="img" aria-label="temple">🏛️</span>
      <p className="font-display text-ivory/90 text-center text-sm font-semibold leading-snug">{title}</p>
      <span className="text-gold/70 text-xs tracking-wider uppercase">{period}</span>
    </div>
  );
}

/* ── Featured (Hero) Card ───────────────────────────────────── */
function FeaturedCard({ monument }: { monument: Monument }) {
  const excerpt = monument.description?.[0]?.children?.[0]?.text ?? '';

  return (
    <Link
      href={`/locations/${monument.slug.current}`}
      className="group relative overflow-hidden rounded-2xl card-heritage border-0 block h-full min-h-[420px]"
      aria-label={`View ${monument.title}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {monument.image ? (
          <Image
            src={monument.image}
            alt={monument.title}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder={monument.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={monument.blurDataURL}
          />
        ) : (
          <MonumentImageFallback title={monument.title} period={monument.period} />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate/95 via-slate/40 to-transparent" />

      {/* Period badge */}
      <div className="absolute top-5 left-5">
        <span className="px-3 py-1.5 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold text-xs font-semibold tracking-widest uppercase">
          {monument.period}
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-gold/80 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Featured Heritage</p>
        <h3 className="font-display text-ivory font-bold leading-tight mb-3 text-2xl-fluid">
          {monument.title}
        </h3>
        {excerpt && (
          <p className="text-parchment/75 text-sm line-clamp-2 leading-relaxed mb-4">
            {excerpt}
          </p>
        )}
        <div className="inline-flex items-center gap-2 text-gold text-xs font-semibold border border-gold/30 rounded-full px-5 py-1.5 group-hover:bg-gold/10 transition-colors duration-300">
          Explore
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ── Regular Card ───────────────────────────────────────────── */
function MonumentCard({ monument }: { monument: Monument }) {
  const excerpt = monument.description?.[0]?.children?.[0]?.text ?? '';

  return (
    <Link
      href={`/locations/${monument.slug.current}`}
      className="group relative overflow-hidden rounded-2xl card-heritage border-0 block h-full min-h-[200px]"
      aria-label={`View ${monument.title}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {monument.image ? (
          <Image
            src={monument.image}
            alt={monument.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder={monument.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={monument.blurDataURL}
          />
        ) : (
          <MonumentImageFallback title={monument.title} period={monument.period} />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/30 to-transparent" />

      {/* Period badge */}
      <div className="absolute top-4 left-4">
        <span className="px-2.5 py-1 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold text-xs font-semibold tracking-wide">
          {monument.period}
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-ivory font-semibold leading-tight mb-2 text-lg">
          {monument.title}
        </h3>
        {excerpt && (
          <p className="text-parchment/65 text-xs line-clamp-1 leading-relaxed mb-2">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-gold text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          Explore
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function FeaturedLegacy({
  monuments = MOCK_MONUMENTS,
}: {
  monuments?: Monument[];
}) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const { t }    = useI18n();

  const displayed = monuments?.length > 0 ? monuments : MOCK_MONUMENTS;

  // Split: first card is hero, rest are secondary
  const [hero, ...rest] = displayed;

  return (
    <section
      ref={ref}
      aria-labelledby="featured-heading"
      className="section-pad bg-background"
    >
      <div className="container-wide">

        {/* ── Section header ── */}
        <motion.div
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Heritage Highlights
          </p>
          <h2
            id="featured-heading"
            className="font-display text-4xl-fluid font-bold text-earth mb-4"
          >
            {t('section.featured')}
          </h2>
          <p className="text-stone text-lg max-w-xl mx-auto leading-relaxed">
            Centuries of devotion, culture, and community — preserved in stone, memory, and living tradition.
          </p>
        </motion.div>

        {/* ── Featured layout ── */}
        <motion.div
          variants={ANIMATION_PRESETS.staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col lg:flex-row gap-5"
        >
          {/* Hero card — takes ~55% width on large screens */}
          {hero && (
            <motion.div
              variants={ANIMATION_PRESETS.staggerItem}
              className="w-full lg:w-[55%] flex-shrink-0"
              style={{ minHeight: '420px' }}
            >
              <FeaturedCard monument={hero} />
            </motion.div>
          )}

          {/* Secondary cards — stack vertically inside remaining space */}
          {rest.length > 0 && (
            <div className="flex-1 flex flex-col gap-5 min-h-[420px]">
              {rest.map((monument) => (
                <motion.div
                  key={monument._id}
                  variants={ANIMATION_PRESETS.staggerItem}
                  className="flex-1"
                  style={{ minHeight: '190px' }}
                >
                  <MonumentCard monument={monument} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── View all link ── */}
        <motion.div
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mt-12"
        >
          <Link
            href="/locations"
            id="view-all-locations"
            className="
              inline-flex items-center gap-2.5
              text-sm font-semibold
              px-6 py-3 rounded-full
              border border-gold/40
              text-gold
              hover:bg-gold hover:text-slate hover:border-gold
              transition-all duration-300
              group
            "
          >
            View All Heritage Locations
            <svg
              className="transition-transform duration-300 group-hover:translate-x-1"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
