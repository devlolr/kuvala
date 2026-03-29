'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';
import Image from 'next/image';
import PeacockSequence from './PeacockSequence';

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

const StoryCard = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="w-full flex flex-col items-center justify-center min-h-screen py-24"
    >
      <div className="max-w-4xl w-full px-6 flex flex-col items-center text-center">
        {/* Glowing badge */}
        <div className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/50" />
          Chapter {index + 1}
          <span className="h-px w-12 bg-gold/50" />
        </div>

        {/* Dynamic Typography based on language */}
        <h2
          className={`
            font-bold mb-8 text-white drop-shadow-2xl
            ${isGujarati ? 'font-gujarati text-4xl md:text-6xl leading-tight' : 'font-display text-4xl md:text-5xl lg:text-7xl tracking-tight'}
          `}
        >
          {t(item.keyTitle)}
        </h2>

        <p
          className={`
            text-cloud text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl drop-shadow-md bg-black/20 p-6 rounded-2xl glass-dark border border-gold/10
            ${isGujarati ? 'font-gujarati' : ''}
          `}
        >
          {t(item.keyDesc)}
        </p>

        {/* Khara Idols Scrollytelling Sequence */}
        {('images' in item) && item.images && (
          <div className="mt-16 w-full max-w-5xl mx-auto">
            <KharaStoryScroller images={item.images} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function SacredHistory() {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();

  return (
    <section className="relative w-full z-10 flex flex-col items-center">
      
      {/* Chapter 1: God's Own Village (Vertical) */}
      <StoryCard item={timelineData[0]} index={0} />

      {/* Chapter 2 Title (Vertical) */}
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] pt-24 text-center">
         <div className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4">
           <span className="h-px w-12 bg-gold/50" />
           Chapter 2
           <span className="h-px w-12 bg-gold/50" />
         </div>
         <h2 className={`font-bold text-white drop-shadow-2xl ${isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-4xl md:text-7xl uppercase'}`}>
           {t('history.2.title')}
         </h2>
      </div>

      {/* Chapter 2: Khara Discovery Scroller (Horizontal Breakout) */}
      <KharaStoryScroller images={timelineData[1].images!} />

      {/* Chapter 3 & onwards (Vertical) */}
      <StoryCard item={timelineData[2]} index={2} />
      <StoryCard item={timelineData[3]} index={3} />
      <StoryCard item={timelineData[4]} index={4} />
      
      {/* Global Finale - Peacock Sequence */}
      <div className="w-full">
         <PeacockSequence />
      </div>
    </section>
  );
}

const KharaStoryScroller = ({ images }: { images: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  
  const totalScenes = 6;
  
  // We use (totalScenes + 1) height to allow the last scene to "rest" for 100vh of scroll
  const scrollHeight = (totalScenes + 1) * 100; 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate translation:
  // We want to reach the last slide (index 5, -500%) 
  // by the time we hit the start of the final "resting" block.
  // totalScenes-1 slides to move + 1 slide of rest = totalScenes blocks of travel
  const x = useTransform(
    scrollYProgress, 
    [0.1, 0.8], // Wait 10% to start, finish by 80% to allow "Dada" to stay visible
    ["0%", `-${(totalScenes - 1) * 100}%`]
  );

  return (
    <div ref={containerRef} style={{ height: scrollHeight + 'vh' }} className="relative w-full">
      
      {/* Sticky Container - Solid background and isolated z-index */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0F1115] z-20 flex items-center shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        <motion.div 
          style={{ x }} 
          className="flex flex-nowrap h-full items-center w-full"
        >
          {Array.from({ length: totalScenes }).map((_, i) => {
             const imageIndex = Math.min(i, images.length - 1);
             const src = images[imageIndex];
             
             return (
               <div key={i} className="w-full h-full flex-shrink-0 flex items-center justify-center px-6 md:px-20 lg:px-32">
                 <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    
                    {/* Immersive Image Column */}
                    <div className="relative aspect-[4/3] md:aspect-video lg:aspect-square w-full rounded-[2.5rem] overflow-hidden glass border-2 border-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.15)] group">
                      <Image 
                        src={src} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt={t('history.2.p' + (i + 1) + '.title')} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                      
                      {/* Decorative accents */}
                      <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-gold/30" />
                      <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-gold/30" />
                    </div>

                    {/* Narrative Text Column */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                      <div className="flex flex-col items-center lg:items-start">
                        <span className="text-gold uppercase tracking-[0.3em] font-bold text-xs md:text-sm mb-2">
                           Scrollytelling Phase {i + 1}
                        </span>
                        <h3 className={'text-white font-bold drop-shadow-lg leading-tight ' + (isGujarati ? 'font-gujarati text-4xl md:text-6xl' : 'font-display text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter')}>
                          {t('history.2.p' + (i + 1) + '.title')}
                        </h3>
                      </div>

                      <div className="bg-black/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-gold/20 glass-dark shadow-2xl relative">
                        <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center text-4xl text-gold/30 font-serif">"</div>
                        
                        <p className={'text-cloud leading-relaxed drop-shadow-md ' + (isGujarati ? 'font-gujarati text-xl md:text-2xl' : 'text-lg md:text-2xl font-medium italic')}>
                          {t('history.2.p' + (i + 1) + '.desc')}
                        </p>
                      </div>
                    </div>

                 </div>
               </div>
             );
          })}
        </motion.div>
      </div>
      
    </div>
  );
}


