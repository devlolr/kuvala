'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { hindVadodara } from '@/lib/fonts';
import { useI18n, useLanguageToggle } from '@/i18n';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const { theme } = useDarkMode();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Core smoothing engine for premium feel
  const smoothY = useSpring(scrollYProgress, { stiffness: 90, damping: 20, restDelta: 0.001 });

  // 1. The Shrink-to-Fit Parallax Glass Pane Transforms
  const paneMaxWidth = useTransform(smoothY, [0, 0.4], ['4000px', '896px']);
  const paneMinHeight = useTransform(smoothY, [0, 0.4], ['100vh', '0vh']);
  const paneRadius = useTransform(smoothY, [0, 0.4], ['0rem', '2.5rem']);
  const borderWidth = useTransform(smoothY, [0, 0.4], ['0px', '1px']);
  const paddingX = useTransform(smoothY, [0, 0.4], ['0px', '24px']);

  // 2. Hero Native Fading Out
  const heroOpacity = useTransform(smoothY, [0, 0.25], [1, 0]);
  const heroY = useTransform(smoothY, [0, 0.25], ['0px', '-50px']);

  // 3. Chapter 1 Title/Desc fading IN and Sliding UP (Tissot Masked Reveal)
  const chapOpacity = useTransform(smoothY, [0.4, 0.55], [0, 1]);
  const chapY = useTransform(smoothY, [0.4, 0.55], ['100%', '0%']);
  const labelOpacity = useTransform(smoothY, [0.35, 0.45], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-transparent z-10">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ paddingLeft: paddingX, paddingRight: paddingX }}
          className="w-full flex justify-center"
        >
          <motion.div
            className="relative w-full flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.1)] border-[#D4AF37]/30"
            style={{
              maxWidth: paneMaxWidth,
              minHeight: paneMinHeight,
              borderRadius: paneRadius,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              background: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'var(--story-card-bg)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* === HERO TEXT (Positioned center explicitly) === */}
            <motion.div
              style={{ opacity: heroOpacity, y: heroY }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            >
              <h1 className={`${hindVadodara.className} text-5xl md:text-6xl lg:text-[7rem] font-bold mb-6 drop-shadow-2xl tracking-tight lg:tracking-tighter leading-[1.1] ${theme === 'light' ? 'text-charcoal' : 'text-white'}`}>
                કુવાળા ગ્રામ
              </h1>
              <p className={`text-xl md:text-2xl lg:text-3xl font-medium max-w-3xl leading-relaxed drop-shadow-lg tracking-wide ${theme === 'light' ? 'text-charcoal/90' : 'text-white/90'}`}>
                A village of living heritage, where ancient temples touch the sky.
              </p>
            </motion.div>

            {/* === CHAPTER 1 TEXT (Natural DOM flow giving the card its final height) === */}
            <div className="relative z-10 w-full flex flex-col items-center text-center px-4 md:px-16 py-12 md:py-20 pointer-events-none">
              <motion.div style={{ opacity: labelOpacity }} className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
                <span className="h-px w-12 bg-gold/50" />
                {t('history.chapter')} 1
                <span className="h-px w-12 bg-gold/50" />
              </motion.div>

              {/* Mask Reveal for Title */}
              <div className="overflow-hidden mb-8 w-full flex justify-center">
                <motion.h2
                  style={{ opacity: chapOpacity, y: chapY, display: 'block' }}
                  className={`font-bold drop-shadow-sm ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-5xl lg:text-7xl tracking-tight'} ${theme === 'light' ? 'text-charcoal' : 'text-white'}`}
                >
                  {t('history.1.title')}
                </motion.h2>
              </div>

              {/* Mask Reveal for Description */}
              <div className="overflow-hidden w-full flex justify-center">
                <motion.p
                  style={{ opacity: chapOpacity, y: chapY }}
                  className={`text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl drop-shadow-sm ${isGujarati ? 'font-gujarati' : ''} ${theme === 'light' ? 'text-charcoal/90' : 'text-cloud'}`}
                >
                  {t('history.1.desc')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
