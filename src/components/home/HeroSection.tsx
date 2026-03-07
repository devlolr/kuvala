'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/i18n';
import { ANIMATION_PRESETS } from '@/lib/theme';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax: text moves up as user scrolls
  const y      = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Word-by-word stagger for hero heading
  const headline = t('hero.tagline');
  const subtitle = t('hero.subtitle');

  return (
    <section
      ref={containerRef}
      aria-label="Hero section"
      className="
        relative min-h-svh flex items-center justify-center overflow-hidden
        gradient-mesh
      "
    >
      {/* Decorative overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate/80 pointer-events-none" />

      {/* Floating orbs — pure CSS, no JS */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-8 animate-float pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-terracotta) 0%, transparent 70%)',
          animationDelay: '3s',
        }}
        aria-hidden="true"
      />

      {/* Hero Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-12 bg-gold/60" />
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">
            Est. 17th Century
          </span>
          <span className="h-px w-12 bg-gold/60" />
        </motion.div>

        {/* Main headline — Cinzel display font */}
        <motion.h1
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="font-display text-hero font-bold tracking-tight mb-4 leading-none"
          style={{ fontFamily: 'var(--heading-font)' }}
        >
          <span className="text-gradient-gold">{headline}</span>
        </motion.h1>

        {/* Gujarati headline beneath */}
        <motion.p
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-gujarati text-gold/60 text-2xl font-medium mb-8 tracking-wide"
        >
          કુવાળા ગ્રામ — જ્ઞાન, ભક્તિ અને વારસો
        </motion.p>

        {/* Subtitle */}
        <motion.p
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-parchment/75 text-xl-fluid max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={ANIMATION_PRESETS.staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div variants={ANIMATION_PRESETS.staggerItem}>
            <Link
              href="/legacy"
              id="hero-cta-map"
              className="
                inline-flex items-center gap-3
                px-12 py-5 rounded-full
                gradient-gold text-slate font-bold text-base
                shadow-gold hover:shadow-glow
                transition-all duration-300 hover:scale-105 active:scale-95
                border-shimmer
              "
            >
              {t('hero.cta.map')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          <motion.div variants={ANIMATION_PRESETS.staggerItem}>
            <Link
              href="/events"
              id="hero-cta-events"
              className="
                inline-flex items-center gap-3
                px-12 py-5 rounded-full
                glass border border-gold/30 text-parchment font-bold text-base
                hover:bg-gold/10 hover:border-gold/60
                transition-all duration-300
              "
            >
              {t('hero.cta.events')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-stone text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
}
