'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';
import Image from 'next/image';
import PeacockSequence from './PeacockSequence';
import ScrollHint from '@/components/ui/ScrollHint';
import ChapterProgress from '@/components/ui/ChapterProgress';

const timelineData = [
  {
    id: 1,
    keyTitle: 'history.1.title',
    keyDesc: 'history.1.desc',
  },
  {
    id: 2,
    keyTitle: 'history.2.title',
    keyDesc: 'history.2.desc',
    images: [
      '/images/history/khara-excavation-1.jpg',
      '/images/history/khara-excavation-2.jpg',
      '/images/history/khara-excavation-3.jpg',
      '/images/history/khara-excavation-4.jpg',
      '/images/history/khara-excavation-5.jpg',
    ],
  },
  {
    id: 3,
    keyTitle: 'history.3.title',
    keyDesc: 'history.3.desc',
  },
  {
    id: 4,
    keyTitle: 'history.4.title',
    keyDesc: 'history.4.desc',
  },
  {
    id: 5,
    keyTitle: 'history.5.title',
    keyDesc: 'history.5.desc',
  },
];

/* ── StoryCard ── */
const StoryCard = ({
  item,
  index,
}: {
  item: { keyTitle: string; keyDesc: string };
  index: number;
}) => {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
  });

  /* G2: spring-damp to prevent jitter on fast scroll */
  const opacityRaw = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const yRaw       = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);
  const scaleRaw   = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const opacity    = useSpring(opacityRaw, { stiffness: 120, damping: 20 });
  const y          = useSpring(yRaw,       { stiffness: 120, damping: 20 });
  const scale      = useSpring(scaleRaw,   { stiffness: 120, damping: 20 });

  return (
    /* Option 4: snap each chapter card to top on fling */
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="w-full flex flex-col items-center justify-center min-h-screen py-24 scroll-snap-start story-snap"
    >
      <div className="max-w-4xl w-full px-6 flex flex-col items-center text-center">
        {/* M3: Chapter label via i18n */}
        <div className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/50" />
          {t('history.chapter')} {index + 1}
          <span className="h-px w-12 bg-gold/50" />
        </div>

        <h2
          className={`
            font-bold mb-8 text-white drop-shadow-2xl
            ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-5xl lg:text-7xl tracking-tight'}
          `}
        >
          {t(item.keyTitle)}
        </h2>

        <p
          className={`
            text-cloud text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl drop-shadow-md story-card p-10 md:p-16 rounded-2xl border border-gold/10
            ${isGujarati ? 'font-gujarati' : ''}
          `}
          style={{ background: 'var(--story-card-bg)', backdropFilter: 'blur(24px)' }}
        >
          {t(item.keyDesc)}
        </p>
      </div>
    </motion.div>
  );
};

/* ── KharaStoryScroller ──
 * Options:
 *   1 (ScrollHint):       shows on first entry, "Keep scrolling ↓ to journey through each scene"
 *   2 (scroll-zone):      class applied for Lenis touch damping
 *   3 (ChapterProgress):  right-edge scene dots
 *   4 (scroll-snap):      scroll-snap-start on the section entry
 */
const KharaStoryScroller = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();

  const totalScenes  = 6;
  const scrollHeight = (totalScenes + 1) * 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const xRaw = useTransform(
    scrollYProgress,
    [0.1, 0.8],
    ['0%', `-${(totalScenes - 1) * 100}%`]
  );

  /* G2: spring-damped translation */
  const x = useSpring(xRaw, { stiffness: 60, damping: 18, restDelta: 0.01 });

  /* Derive the current scene index (0-based) from scroll progress */
  const [activeScene, setActiveScene] = useState(0);

  /* Framer motion onChange to drive ChapterProgress (Option 3) */
  useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  }).scrollYProgress.on('change', (v) => {
    // Map 0.1–0.8 → scene 0–5
    const progress = Math.max(0, Math.min(1, (v - 0.1) / 0.7));
    setActiveScene(Math.min(totalScenes - 1, Math.floor(progress * totalScenes)));
  });

  const scenes = Array.from({ length: totalScenes }).map((_, i) => ({
    src: images[Math.min(i, images.length - 1)],
    index: i,
  }));

  interface SceneCardProps { src: string; index: number }

  const SceneCard = ({ src, index }: SceneCardProps) => (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center w-full lg:max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-0">
      {/* Image */}
      <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border-2 border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.12)] group flex-shrink-0">
        <Image
          src={src}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
          alt={t('history.2.p' + (index + 1) + '.title')}
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/30" />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 w-full lg:w-1/2">
        <div>
          <span className="text-gold uppercase tracking-[0.3em] font-bold text-xs md:text-sm mb-2 block">
            {t('history.phase')} {index + 1}
          </span>
          <h3 className={'text-white font-bold drop-shadow-lg ' + (isGujarati ? 'font-gujarati text-3xl md:text-5xl' : 'font-display text-2xl md:text-4xl lg:text-5xl uppercase tracking-tighter')}>
            {t('history.2.p' + (index + 1) + '.title')}
          </h3>
        </div>

        <div
          className="story-card p-8 md:p-16 rounded-[2rem] border border-gold/20 shadow-2xl relative w-full"
          style={{ background: 'var(--story-card-bg)', backdropFilter: 'blur(24px)' }}
        >
          {/* C2: Heritage-scale decorative quote mark */}
          <span className="heritage-quote-mark">&ldquo;</span>
          <p className={'text-cloud leading-relaxed drop-shadow-md pt-4 ' + (isGujarati ? 'font-gujarati text-lg md:text-xl' : 'text-base md:text-xl font-medium italic')}>
            {t('history.2.p' + (index + 1) + '.desc')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile (<lg): vertical stack ── */}
      <div 
        className="lg:hidden w-full flex flex-col divide-y divide-gold/10 scroll-snap-container-mandatory scroll-snap-section"
      >
        {/* Option 1: Show horizontal scroll hint on mobile — vertical scroll drives horizontal content */}
        <ScrollHint
          observeRef={containerRef as React.RefObject<HTMLElement>}
          mode="horizontal"
          hintKey="khara-mobile"
          position="bottom-center"
          duration={5000}
        />
        {scenes.map(({ src, index }) => (
          <div key={index} className="w-full scroll-snap-section min-h-[100dvh] flex items-center justify-center py-20">
            <SceneCard src={src} index={index} />
          </div>
        ))}
      </div>

      {/* ── Desktop (>=lg): sticky horizontal scroll-driven cinematic ── */}
      {/* Option 4: scroll-snap-start — browser snaps to section entry on fast fling */}
      <div
        ref={containerRef}
        style={{ height: scrollHeight + 'vh' }}
        /* Options 2 + 4: scroll-zone for Lenis damping + scroll-snap-start to anchor section */
        className="relative w-full hidden lg:block scroll-zone scroll-snap-start"
      >
        {/* Option 1: Scroll hint for desktop — explains ↓ scroll drives horizontal scenes */}
        <ScrollHint
          observeRef={containerRef}
          mode="horizontal"
          hintKey="khara-desktop"
          position="bottom-center"
          duration={5000}
        />

        {/* Option 3: Chapter progress dots — right edge */}
        <ChapterProgress
          total={totalScenes}
          currentIndex={activeScene}
          label={t('history.phase')}
        />

        <div
          className="sticky top-0 h-screen w-full overflow-hidden z-20 flex items-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          style={{ background: 'var(--story-bg)' }}
        >
          <motion.div
            style={{ x }}
            className="flex flex-nowrap h-full items-center w-full"
          >
            {scenes.map(({ src, index }) => (
              <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center px-8 lg:px-20">
                <SceneCard src={src} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

/* ── SacredHistory (main export) ── */
export default function SacredHistory() {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    /* M4: Use CSS variable + Options 2+4 */
    <section
      ref={sectionRef}
      className="relative w-full z-10 flex flex-col items-center always-dark scroll-zone"
      style={{ background: 'var(--story-bg)' }}
    >
      {/* Option 1: Global story hint on section entry */}
      <ScrollHint
        observeRef={sectionRef}
        mode="vertical"
        hintKey="sacred-history"
        position="bottom-right"
        duration={4500}
      />

      {/* Chapter 1 — Option 4: scroll-snap-start */}
      <StoryCard item={timelineData[0]} index={0} />

      {/* Chapter 2 title — Standalone full-screen card on mobile */}
      <div className="w-full flex flex-col items-center justify-center min-h-[100dvh] text-center px-6 scroll-snap-start">
        <div className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/50" />
          {t('history.chapter')} 2
          <span className="h-px w-12 bg-gold/50" />
        </div>
        <h2 className={`font-bold text-white drop-shadow-2xl ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-7xl uppercase'}`}>
          {t('history.2.title')}
        </h2>
      </div>

      {/* Chapter 2: Khara Discovery */}
      <KharaStoryScroller images={timelineData[1].images!} />

      {/* Chapters 3-5 — each snaps on fast scroll */}
      <StoryCard item={timelineData[2]} index={2} />
      <StoryCard item={timelineData[3]} index={3} />
      <StoryCard item={timelineData[4]} index={4} />

      {/* Finale: Peacock Sequence */}
      <div className="w-full scroll-snap-section">
        <PeacockSequence />
      </div>
    </section>
  );
}
