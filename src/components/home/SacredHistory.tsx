'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';
import Image from 'next/image';
import PeacockSequence from './PeacockSequence';
import ScrollHint from '@/components/ui/ScrollHint';
import ChapterProgress from '@/components/ui/ChapterProgress';
import { useDarkMode } from '@/hooks/useDarkMode';

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
  const { theme } = useDarkMode();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
  });

  const opacityRaw = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const yRaw       = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);
  const scaleRaw   = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  // The Curtained Mask Reveal for Content natively synced to user's scroll speed
  const textOpacityRaw = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const textYRaw = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], ['100%', '0%', '0%', '-100%']);

  const opacity    = useSpring(opacityRaw, { stiffness: 120, damping: 20 });
  const y          = useSpring(yRaw,       { stiffness: 120, damping: 20 });
  const scale      = useSpring(scaleRaw,   { stiffness: 120, damping: 20 });

  const textOpacity = useSpring(textOpacityRaw, { stiffness: 100, damping: 20 });
  const textY = useSpring(textYRaw, { stiffness: 100, damping: 20 });

  return (
    /* Option 4: snap each chapter card to top on fling */
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="w-full flex flex-col items-center justify-center min-h-screen py-24 scroll-snap-start story-snap"
    >
      <div
        className="max-w-4xl w-full px-8 md:px-16 py-12 md:py-20 flex flex-col items-center text-center story-card rounded-[2.5rem] border border-gold/20 shadow-2xl"
        style={{ background: 'var(--story-card-glass)', backdropFilter: 'blur(8px)' }}
      >
        {/* M3: Chapter label via i18n */}
        <motion.div style={{ opacity: textOpacity }} className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/50" />
          {t('history.chapter')} {index + 1}
          <span className="h-px w-12 bg-gold/50" />
        </motion.div>

        {/* Tissot Mask Reveal: Title */}
        <div className="overflow-hidden mb-8 w-full flex justify-center">
          <motion.h2
            style={{ opacity: textOpacity, y: textY, display: 'block', color: 'var(--hero-title-clr)' }}
            className={`font-bold drop-shadow-sm ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-5xl lg:text-7xl tracking-tight'}`}
          >
            {t(item.keyTitle)}
          </motion.h2>
        </div>

        {/* Tissot Mask Reveal: Paragraph */}
        <div className="overflow-hidden w-full flex justify-center">
          <motion.p
            style={{ opacity: textOpacity, y: textY }}
            className={`
              text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl drop-shadow-sm
              ${isGujarati ? 'font-gujarati' : ''}
              ${theme === 'light' ? 'text-charcoal/90' : 'text-[#F0EDE1]'}
            `}
          >
            {t(item.keyDesc)}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── KharaStoryScroller ──
 * Options:
 *   1 (ScrollHint):       shows on first entry, "Keep scrolling ↓ to journey through each scene"
 *   2 (scroll-zone):      class applied for Lenis touch damping
 *   3 (ChapterProgress):  right-edge scene dots
 *   4 (scroll-snap):      scroll-snap-start on snap targets
 */
const KharaStoryScroller = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const { theme } = useDarkMode();

  const totalScenes = 6;
  const scrollHeight = totalScenes * 100; // Exact length 600vh

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track translation for the bottom text track
  const xTextRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(totalScenes - 1) * 100}%`]
  );

  /* G2: spring-damped translation */
  const xText = useSpring(xTextRaw, { stiffness: 60, damping: 18, restDelta: 0.01 });

  /* Derive the current scene index (0-based) from scroll progress */
  const [activeScene, setActiveScene] = useState(0);

  /* Framer motion onChange to drive ChapterProgress (Option 3) */
  useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  }).scrollYProgress.on('change', (v) => {
    const progress = Math.max(0, Math.min(1, v));
    setActiveScene(Math.min(totalScenes - 1, Math.round(progress * (totalScenes - 1))));
  });

  const scenes = Array.from({ length: totalScenes }).map((_, i) => ({
    src: images[Math.min(i, images.length - 1)],
    index: i,
  }));

  /* Magnetic Auto-Snapping for Mobile (and Desktop) */
  /* Replaces native CSS scroll-snap which behaves unreliably alongside Lenis smoothing */
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      // Wait 150ms after scroll stops to trigger snap
      scrollTimeout = setTimeout(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Distance scrolled into this container
        const scrolledIn = -rect.top;
        const maxScrollDist = rect.height - viewportHeight;
        
        // Only engage snapping if the user is actively inside the scrolling sequence
        if (scrolledIn > 10 && scrolledIn < maxScrollDist - 10) {
           // We use a 50% threshold: halfway scrolled -> rounds to the next frame
           const nearestFrame = Math.round(scrolledIn / viewportHeight);
           
           // Calculate exactly where the window should scroll to
           const targetY = (window.scrollY + rect.top) + (nearestFrame * viewportHeight);
           
           // Snap if we are off by more than 5 pixels to avoid micro-jitter loops
           if (Math.abs(window.scrollY - targetY) > 5) {
             if ((window as any).lenis) {
               (window as any).lenis.scrollTo(targetY, { duration: 1.2 });
             } else {
               window.scrollTo({ top: targetY, behavior: 'smooth' });
             }
           }
        }
      }, 150); 
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: `${scrollHeight}vh` }}
      className="relative w-full scroll-zone"
    >
      <ScrollHint
        observeRef={containerRef}
        mode="horizontal"
        hintKey="khara-timeline"
        position="bottom-center"
        duration={5000}
      />

      <ChapterProgress
        total={totalScenes}
        currentIndex={activeScene}
        label={t('history.phase')}
      />

      {/* Sticky Checkpoint (100vh) */}
      <div
        className={`sticky top-0 h-[100dvh] w-full overflow-hidden z-20 flex flex-col justify-center ${theme === 'dark' ? 'shadow-[0_0_100px_rgba(0,0,0,0.8)]' : 'shadow-none'}`}
        style={{ background: 'transparent' }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center pt-24 md:pt-20 pb-8 md:pb-0 px-4">
          <div className="w-full max-w-6xl flex flex-col items-center gap-6 md:gap-10">
            {/* Top Half: Overlapping Static Images */}
            <div className="relative w-full max-h-[35vh] md:max-h-[45vh] flex items-center justify-center z-10">
              <div className="relative w-full md:w-3/4 max-w-5xl aspect-[4/3] md:aspect-[21/9] lg:aspect-[16/7] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border-2 border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.12)] bg-black/50">
                {scenes.map(({ src, index }) => {
                   const startOffset = Math.max(0, (index - 1) / (totalScenes - 1));
                   const endOffset = index / (totalScenes - 1);
                   const xImgRaw = useTransform(
                      scrollYProgress,
                      [startOffset, endOffset],
                      index === 0 ? ['0%', '0%'] : ['100%', '0%']
                   );
                   const xImg = useSpring(xImgRaw, { stiffness: 60, damping: 18, restDelta: 0.01 });

                   return (
                     <motion.div 
                       key={index}
                       className="absolute inset-0 w-full h-full"
                       style={{ x: xImg, zIndex: index }}
                     >
                        <Image
                          src={src}
                          fill
                          className="object-cover"
                          alt={t('history.2.p' + (index + 1) + '.title')}
                          sizes="(max-width: 1024px) 90vw, 75vw"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                     </motion.div>
                   );
                })}
                <div className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-gold/30 z-[100] pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-gold/30 z-[100] pointer-events-none" />
              </div>
            </div>

            {/* Bottom Half: Horizontal Text Track with Static Frame */}
            <div className="relative w-full z-20 flex justify-center px-4 md:px-6">
              <div
                className="w-full max-w-4xl story-card rounded-[2rem] md:rounded-[2.5rem] border border-gold/20 shadow-2xl relative overflow-hidden"
                style={{ background: 'var(--story-card-glass)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div
                  style={{ x: xText }}
                  className="flex flex-nowrap w-full"
                >
                  {scenes.map(({ index }) => (
                    <div key={index} className="w-full flex-shrink-0 flex flex-col justify-center items-center text-center p-8 md:p-12 lg:p-16">
                      <div className="mb-2">
                        <span className="text-gold uppercase tracking-[0.3em] font-bold text-xs md:text-sm mb-4 block">
                          {t('history.phase')} {index + 1}
                        </span>
                        <h3 style={{ color: 'var(--hero-title-clr)' }} className={`font-bold drop-shadow-sm ${isGujarati ? 'font-gujarati text-3xl md:text-4xl lg:text-5xl' : 'font-display text-2xl md:text-3xl lg:text-5xl uppercase tracking-tighter'}`}>
                          {t('history.2.p' + (index + 1) + '.title')}
                        </h3>
                      </div>

                      <div className="relative w-full pt-2 md:pt-4">
                        <span className="heritage-quote-mark hidden md:block text-3xl top-0 left-0 absolute opacity-40">&ldquo;</span>
                        <p style={{ color: 'var(--hero-desc-clr)' }} className={`leading-relaxed md:leading-loose drop-shadow-sm pb-1 md:pb-2 ${isGujarati ? 'font-gujarati text-xl md:text-xl lg:text-2xl' : 'text-lg md:text-lg lg:text-xl font-medium italic'}`}>
                          {t('history.2.p' + (index + 1) + '.desc')}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snap point targets */}
      <div className="absolute top-0 left-0 w-full pointer-events-none h-full flex flex-col z-0">
         {scenes.map((_, i) => (
           <div key={i} className="h-[100vh] w-full scroll-snap-start" />
         ))}
      </div>
    </div>
  );
};

/* ── SacredHistory (main export) ── */
export default function SacredHistory() {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const { theme } = useDarkMode();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    /* M4: Use CSS variable + Options 2+4 */
    <section
      ref={sectionRef}
      className={`relative w-full z-10 flex flex-col items-center scroll-zone ${theme === 'dark' ? 'always-dark' : ''}`}
      style={{ background: 'transparent' }}
    >
      {/* Option 1: Global story hint on section entry */}
      <ScrollHint
        observeRef={sectionRef}
        mode="vertical"
        hintKey="sacred-history"
        position="bottom-right"
        duration={4500}
      />

      {/* Chapter 1 is NOW managed exclusively inside HeroSection.tsx to achieve the Shrink-to-Fit Parallax.
          We skip timelineData[0] and begin directly on Chapter 2. */}

      {/* Chapter 2 title — Standalone full-screen card on mobile */}
      <div className="w-full flex flex-col items-center justify-center min-h-[100dvh] text-center px-6 pt-20 md:pt-0 scroll-snap-start">
        <div
          className="flex flex-col items-center justify-center story-card p-12 md:p-24 rounded-[2.5rem] border border-gold/20 shadow-2xl max-w-4xl w-full"
          style={{ background: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'var(--story-card-bg)', backdropFilter: 'blur(8px)' }}
        >
          <div className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/50" />
            {t('history.chapter')} 2
            <span className="h-px w-12 bg-gold/50" />
          </div>
          <h2 className={`font-bold drop-shadow-sm ${theme === 'light' ? 'text-charcoal' : 'text-white'} ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-7xl uppercase'}`}>
            {t('history.2.title')}
          </h2>
        </div>
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
