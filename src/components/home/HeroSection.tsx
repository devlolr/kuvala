'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/i18n';
import { ANIMATION_PRESETS } from '@/lib/theme';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useI18n();

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

      {/* Mangala Charan — Auspicious Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-8 left-0 right-0 z-20 flex items-center justify-center gap-4 pointer-events-none px-4"
      >
        <span className="h-px w-6 bg-gold/30 shrink-0" />
        <span className={`
          text-gold/70 text-[0.5rem] md:text-xs font-semibold text-center
          ${lang === 'gu' ? 'font-gujarati' : 'uppercase tracking-[0.1em]'}
        `}>
          {t('hero.invocation')}
        </span>
        <span className="h-px w-6 bg-gold/30 shrink-0" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full"
      >
        {/* Eyebrow Lineage */}
        <motion.div
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex items-center justify-center gap-3 mb-10 px-4 w-full"
        >
          <span className="h-px w-4 md:w-16 bg-gold/40 shrink-0 hidden sm:block" />
          <p className={`
            text-gold font-semibold uppercase text-center max-w-4xl px-2
            ${lang === 'gu' 
              ? 'font-gujarati text-[0.8rem] md:text-base tracking-[0.01em]' 
              : 'text-[0.65rem] md:text-xs tracking-[0.15em] leading-relaxed break-words'
            }
          `}>
            {t('hero.lineage')}
          </p>
          <span className="h-px w-4 md:w-16 bg-gold/40 shrink-0 hidden sm:block" />
        </motion.div>

        {/* Main headline — Cinzel display font */}
        <motion.h1
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="font-display text-hero font-bold tracking-tight mb-4 leading-none text-center"
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
          className="font-gujarati text-gold/90 text-2xl font-bold mb-8 tracking-wide text-center"
        >
          કુવાળા ગ્રામ — જ્ઞાન, ભક્તિ અને વારસો
        </motion.p>

        {/* Subtitle */}
        <motion.p
          variants={ANIMATION_PRESETS.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-parchment/75 text-xl-fluid max-w-2xl leading-relaxed mb-10 text-center mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={ANIMATION_PRESETS.staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4"
        >
          <motion.div variants={ANIMATION_PRESETS.staggerItem} className="w-full sm:w-auto">
            <Link
              href="/legacy"
              id="hero-cta-map"
              className="
                inline-flex items-center justify-center gap-3
                px-8 py-5 rounded-full
                gradient-gold text-slate font-bold text-base
                shadow-gold hover:shadow-glow
                transition-all duration-300 hover:scale-105 active:scale-95
                border-shimmer w-full sm:min-w-[16rem]
              "
            >
              {t('hero.cta.map')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          <motion.div variants={ANIMATION_PRESETS.staggerItem} className="w-full sm:w-auto">
            <Link
              href="/events"
              id="hero-cta-events"
              className="
                inline-flex items-center justify-center gap-3
                px-8 py-5 rounded-full
                glass border border-gold/30 text-parchment font-bold text-base
                hover:bg-gold/10 hover:border-gold/60
                transition-all duration-300 w-full sm:min-w-[16rem]
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
