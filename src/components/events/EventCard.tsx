'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ANIMATION_PRESETS } from '@/lib/theme';
import { useI18n } from '@/i18n';

export interface SanityEvent {
  _id:      string;
  title:    string;
  slug:     string;
  date:     string;
  location: string;
  capacity: number;
  excerpt?: string;
  image?:   string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function EventCard({ event }: { event: SanityEvent }) {
  const ref     = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const { t }   = useI18n();

  return (
    <motion.article
      ref={ref}
      variants={ANIMATION_PRESETS.staggerItem}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="card-heritage p-5 flex flex-col sm:flex-row gap-5"
      aria-labelledby={`event-${event._id}-title`}
    >
      {/* Date block */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl gradient-gold text-slate font-display font-bold shadow-gold">
        <span className="text-xl leading-none">
          {new Date(event.date).getDate()}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">
          {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          id={`event-${event._id}-title`}
          className="font-display text-earth font-semibold text-lg leading-snug mb-1"
        >
          {event.title}
        </h3>

        {event.excerpt && (
          <p className="text-stone text-sm leading-relaxed line-clamp-2 mb-3">
            {event.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-stone">
          <span className="flex items-center gap-1">
            📅 {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1">
            📍 {event.location}
          </span>
          <span className="flex items-center gap-1">
            👥 {t('event.capacity')}: {event.capacity}
          </span>
        </div>
      </div>

      {/* Register CTA */}
      <div className="flex-shrink-0 flex items-center">
        <Link
          href={`/events#register-${event._id}`}
          id={`event-register-${event._id}`}
          className="
            px-5 py-2.5 rounded-full text-xs font-semibold
            border border-gold/50 text-gold
            hover:bg-gold hover:text-slate hover:border-gold
            transition-all duration-200 whitespace-nowrap
            focus-visible:ring-2 focus-visible:ring-gold
          "
        >
          {t('event.register')}
        </Link>
      </div>
    </motion.article>
  );
}
