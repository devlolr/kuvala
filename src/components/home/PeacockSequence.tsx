import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';
import ScrollHint from '@/components/ui/ScrollHint';
import ChapterProgress from '@/components/ui/ChapterProgress';

// To avoid overloading the initial bundle, we specify how many frames we have.
const TOTAL_FRAMES = 125; 

export default function PeacockSequence({ totalFrames = TOTAL_FRAMES }: { totalFrames?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0-1) to an exact frame number (1 - totalFrames)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  // Text Animations
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.45, 0.6], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.25, 0.45, 0.6], [50, 0, 0, -50]);
  
  const descOpacity = useTransform(scrollYProgress, [0.55, 0.7, 0.85, 0.95], [0, 1, 1, 0]);
  const descY = useTransform(scrollYProgress, [0.55, 0.7, 0.85, 0.95], [50, 0, 0, -50]);

  // Option 3: Reactive phase for ChapterProgress (0=title reveal, 1=narrative, 2=rest)
  const [peacockPhase, setPeacockPhase] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setPeacockPhase(v < 0.45 ? 0 : v < 0.75 ? 1 : 2);
    });
    return unsub;
  }, [scrollYProgress]);

  // Preload frames to prevent flickering
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(4, '0');
      img.src = `/images/peacock-seq/frame_${paddedIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, [totalFrames]);

  // Draw exactly the calculated frame each time `frameIndex` value changes
  useEffect(() => {
    if (images.length === 0) return;

    let animationFrameId: number;

    const render = () => {
      const val = frameIndex.get();
      const currentFrame = Math.min(
        totalFrames - 1, 
        Math.max(0, Math.floor(val) - 1)
      );

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = images[currentFrame];

      if (canvas && ctx && img && img.complete) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate aspect ratio covering
        const canvasAspectRatio = canvas.width / canvas.height;
        const imgAspectRatio = img.width / img.height;

        let renderWidth = canvas.width;
        let renderHeight = canvas.height;
        let x = 0;
        let y = 0;

        if (canvasAspectRatio > imgAspectRatio) {
          // Canvas is wider than image -> fit by height
          renderHeight = canvas.height;
          renderWidth = canvas.height * imgAspectRatio;
          x = (canvas.width - renderWidth) / 2;
          y = 0;
        } else {
          // Canvas is taller than image -> fit by width
          renderWidth = canvas.width;
          renderHeight = canvas.width / imgAspectRatio;
          x = 0;
          y = (canvas.height - renderHeight) / 2;
        }

        ctx.drawImage(img, x, y, renderWidth, renderHeight);
      }
    };

    const unsubscribe = frameIndex.on("change", () => {
       animationFrameId = requestAnimationFrame(render);
    });

    // Initial render
    render();

    return () => {
      unsubscribe();
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, frameIndex, totalFrames]);

  return (
    /* Options 2 + 4: scroll-zone (Lenis damping) + scroll-snap-start (CSS snap) */
    <div ref={containerRef} className="relative w-full h-[600vh] scroll-zone scroll-snap-start">
      {/* Option 1: Scroll hint for peacock section */}
      <ScrollHint
        observeRef={containerRef}
        mode="peacock"
        hintKey="peacock-sequence"
        position="bottom-center"
        duration={5000}
      />

      {/* Option 3: Chapter progress — 3 phases: title / narrative / end */}
      <ChapterProgress
        total={3}
        currentIndex={peacockPhase}
        label="Sequence"
      />

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 w-full h-[100vh] overflow-hidden bg-black z-0 flex items-center justify-center p-8 md:p-12">
        {images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 backdrop-blur-md">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                <span className="text-gold font-medium animate-pulse">Loading Sacred Sequence...</span>
             </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain opacity-70 md:opacity-100"
        />
      </div>

      {/* Floating Text Blocks over the scrubbed video */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Section 1: Title Reveal */}
          <div className="h-screen w-full flex items-center justify-center relative">
              <motion.div 
                style={{ opacity: titleOpacity, y: titleY }}
                className="max-w-4xl px-6 text-center"
              >
                  <h2 className={'text-gold font-bold mb-4 tracking-[0.2em] ' + (isGujarati ? 'font-gujarati text-4xl md:text-7xl' : 'font-display text-3xl md:text-6xl uppercase')}>
                    {t('history.6.title')}
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
              </motion.div>
          </div>

          <div className="h-[100vh]" />

          {/* Section 2: Narrative Reveal */}
          <div className="h-screen w-full flex items-center justify-center relative">
              <motion.div 
                style={{ opacity: descOpacity, y: descY }}
                className="max-w-5xl px-8 text-center"
              >
                  <div className="bg-black/80 backdrop-blur-2xl px-12 py-16 rounded-[2.5rem] border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                    <p className={'text-white/95 leading-relaxed drop-shadow-md ' + (isGujarati ? 'font-gujarati text-2xl md:text-4xl' : 'text-xl md:text-3xl font-medium italic')}>
                      "{t('history.6.desc')}"
                    </p>
                  </div>
              </motion.div>
          </div>
          
          <div className="h-[200vh]" />
      </div>
    </div>
  );
}
