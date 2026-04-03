'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { hindVadodara } from '@/lib/fonts';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Background scales up (Ken Burns)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  
  // Text slides up and fades out
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-obsidian"
    >
      {/* Background Image with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ scale }}
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop')" 
          }}
        >
           {/* G1: Lighter, more cinematic overlay — image stays visible */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-black/30 to-black/20" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
      >
        <h1 className={`${hindVadodara.className} text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-xl tracking-wide leading-tight`}>
          કુવાળા ગ્રામ: ગોકુળ જેવું સુંદર નગર
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed text-shadow-md">
          A village of living heritage, where the soil smells of pure character and ancient temples touch the sky.
        </p>
      </motion.div>
    </section>
  );
}
