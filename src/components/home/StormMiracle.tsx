'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n, useLanguageToggle } from '@/i18n';
import { useDarkMode } from '@/hooks/useDarkMode';

/**
 * StormMiracle — Cinematic Morphing Card Theater  (v2)
 *
 * Architecture (unchanged):
 * - CSS sticky viewport; GSAP drives only text timeline via scrub.
 * - One persistent glass card; text layers transition inside it.
 *
 * Visual enhancements (v2):
 * - Ambient dual-orb glow field behind the card (gold + indigo/crimson).
 * - Animated SVG lightning bolt that plays on Chapter 3 entry.
 * - Floating Sanskrit "OM" / lotus particle field.
 * - Richer card: double-border shimmer ring + inner gradient overlay.
 * - Chapter counter pill with progress bar.
 * - Cinematic letter-spacing on chapter labels.
 * - Responsive — same layout from 320 px to 4K.
 */

const TOTAL_BLOCKS = 5; // 1 title + 4 narrative
const BLOCK_IDS = [1, 2, 3, 4];

/* ── Ambient particle symbols ── */
const MANTRA = ['ॐ', 'ह्रीँ', 'श्रीँ', 'श्री', 'जीरावला', 'पार्श्वनाथ', 'रक्षां', 'कुरु', 'कुरु', 'स्वाहा'];

// Generate a larger set of randomized particles for a continuous "rain" feel
const PARTICLES = Array.from({ length: 50 }).map((_, i) => ({
  x: Math.random() * 100,            // Random horizontal position
  y: -20,                            // Start above screen
  s: 0.6 + Math.random() * 0.8,      // Random scale (0.6 to 1.4)
  d: 12 + Math.random() * 15,        // Random duration (12s to 27s) for varying speeds
  delay: Math.random() * -30,        // Negative delay to start at different points in path
  char: MANTRA[i % MANTRA.length],   // Cycle through mantra symbols
}));

/* ── SVG Lightning Bolt ─────────────────────────────────────────── */
function LightningBolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="60" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EACE84" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#AF8231" />
          <stop offset="1" stopColor="#9A2A2A" stopOpacity="0.6" />
        </linearGradient>
        <filter id="boltGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        className="sm-bolt-path"
        d="M38 2 L12 62 L28 62 L22 118 L48 48 L32 48 Z"
        fill="url(#boltGrad)"
        filter="url(#boltGlow)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Decorative corner mandala ──────────────────────────────────── */
function CornerMandala({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden="true">
      <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 2" opacity="0.5" />
      <circle cx="80" cy="80" r="56" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <circle cx="80" cy="80" r="36" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line key={i}
            x1={80 + 36 * Math.cos(a)} y1={80 + 36 * Math.sin(a)}
            x2={80 + 56 * Math.cos(a)} y2={80 + 56 * Math.sin(a)}
            stroke="currentColor" strokeWidth="0.4" opacity="0.3"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const x = 80 + 68 * Math.cos(a), y = 80 + 68 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" opacity="0.3" />;
      })}
      <circle cx="80" cy="80" r="5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export default function StormMiracle() {
  const { t } = useI18n();
  const { isGujarati } = useLanguageToggle();
  const { theme } = useDarkMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionRef   = useRef<HTMLElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const boltRef      = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const textLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  const setLayerRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      textLayersRef.current[index] = el;
    },
    [],
  );

  const setParticleRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      particlesRef.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      if (!sectionRef.current || !cardRef.current) return;
      
      // Select all layers robustly via class
      const layers = Array.from(sectionRef.current.querySelectorAll('.sm-layer')) as HTMLDivElement[];
      if (layers.length === 0) return;

      const ctx = gsap.context(() => {

        /* ── Card ambient wobble (always running) ─────────── */
        gsap.to(cardRef.current, {
          y: -10,
          rotateZ: 0.25,
          duration: 4.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        /* ── Initial states ───────────────────────────────── */
        layers.forEach((layer, i) => {
          const title      = layer.querySelector('.block-title, .title-main');
          const desc       = layer.querySelector('.block-desc, .title-sub');
          const phaseLabel = layer.querySelector('.phase-label, .chapter-label');
          const goldBar    = layer.querySelector('.gold-bar');
          const goldLines  = layer.querySelectorAll('.gold-line');
          const eyebrow    = layer.querySelector('.sm-eyebrow');
          const ornament   = layer.querySelector('.sm-ornament');

          gsap.set(layer, { zIndex: 10 + i }); // Ensure correct stacking order

          if (i === 0) {
            gsap.set(layer,       { opacity: 1, pointerEvents: 'auto' });
            gsap.set(title,       { x: 100, opacity: 0 });
            gsap.set(desc,        { x: -100, opacity: 0 });
            gsap.set(phaseLabel,  { opacity: 0, y: -15 });
            gsap.set(goldLines,   { scaleX: 0 });
            if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 10 });
            if (ornament) gsap.set(ornament, { opacity: 0, scale: 0.7 });
          } else {
            gsap.set(layer,       { opacity: 0, pointerEvents: 'none' });
            if (title)     gsap.set(title, { x: 120, opacity: 0 });
            if (desc)      gsap.set(desc,  { x: -80, opacity: 0 });
            if (phaseLabel) gsap.set(phaseLabel, { opacity: 0, letterSpacing: '1em', y: 10 });
            if (goldBar)   gsap.set(goldBar, { scaleX: 0 });
            if (eyebrow)   gsap.set(eyebrow, { opacity: 0, y: 8 });
            if (ornament)  gsap.set(ornament, { opacity: 0, scale: 0.6 });
          }
        });

        /* ── Entrance for title layer ──────────────────────── */
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        const layer0 = layers[0];
        const eyebrow0 = layer0.querySelector('.sm-eyebrow');
        const ornament0 = layer0.querySelector('.sm-ornament');

        if (eyebrow0) entranceTl.to(eyebrow0, { opacity: 1, y: 0, duration: 0.25 });
        entranceTl
          .to(layer0.querySelector('.chapter-label'), { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '<0.1')
          .to(layer0.querySelectorAll('.gold-line'),  { scaleX: 1, duration: 0.5, ease: 'power2.inOut', stagger: 0.1 }, '<0.1')
          .to(layer0.querySelector('.title-main'),    { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<0.15')
          .to(layer0.querySelector('.title-sub'),     { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<0.2');
        if (ornament0) entranceTl.to(ornament0, { opacity: 0.15, scale: 1, duration: 0.5, ease: 'back.out' }, '<0.3');

        /* ── Progress bar scrub ────────────────────────────── */
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          });
          gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
        }

        /* ── Master scroll timeline ────────────────────────── */
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onToggle: (self) => {
              document.documentElement.style.scrollSnapType = self.isActive ? 'none' : 'y proximity';
            },
          },
        });

        for (let i = 0; i < layers.length - 1; i++) {
          const curr = layers[i];
          const next = layers[i + 1];
          const offset = i;

          const currTitle    = curr.querySelector('.block-title, .title-main');
          const currDesc     = curr.querySelector('.block-desc, .title-sub');
          const currPhase    = curr.querySelector('.phase-label, .chapter-label');
          const currGoldLines = curr.querySelectorAll('.gold-line');
          const currGoldBar  = curr.querySelector('.gold-bar');
          const currEyebrow  = curr.querySelector('.sm-eyebrow');
          const currOrnament = curr.querySelector('.sm-ornament');

          const nextTitle    = next.querySelector('.block-title');
          const nextDesc     = next.querySelector('.block-desc');
          const nextPhase    = next.querySelector('.phase-label');
          const nextGoldBar  = next.querySelector('.gold-bar');
          const nextEyebrow  = next.querySelector('.sm-eyebrow');
          const nextOrnament = next.querySelector('.sm-ornament');

          /* EXIT */
          if (currGoldLines.length) masterTl.to(currGoldLines, { scaleX: 0, duration: 0.25, ease: 'power2.in' }, offset);
          if (currGoldBar) masterTl.to(currGoldBar, { scaleX: 0, duration: 0.25, ease: 'power2.in' }, offset);
          if (currPhase)   masterTl.to(currPhase,   { opacity: 0, y: -15, duration: 0.3,  ease: 'power2.in' }, offset);
          if (currEyebrow) masterTl.to(currEyebrow, { opacity: 0, y: -8,  duration: 0.25, ease: 'power2.in' }, offset);
          if (currOrnament) masterTl.to(currOrnament, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.in' }, offset);
          if (currTitle)   masterTl.to(currTitle, { x: -250, opacity: 0, duration: 0.45, ease: 'power2.in' }, offset + 0.05);
          if (currDesc)    masterTl.to(currDesc,  { x:  150, opacity: 0, duration: 0.45, ease: 'power2.in' }, offset + 0.1);
          masterTl.set(curr, { opacity: 0, pointerEvents: 'none' }, offset + 0.45);

          /* ENTER */
          masterTl.set(next, { opacity: 1, pointerEvents: 'auto' }, offset + 0.5);
          if (nextGoldBar) masterTl.fromTo(nextGoldBar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, offset + 0.52);
          if (nextEyebrow) masterTl.fromTo(nextEyebrow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, offset + 0.52);
          if (nextPhase)   masterTl.fromTo(nextPhase, { opacity: 0, letterSpacing: '1em', y: 10 }, { opacity: 0.8, letterSpacing: '0.4em', y: 0, duration: 0.45, ease: 'power2.out' }, offset + 0.55);
          if (nextTitle)   masterTl.fromTo(nextTitle, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, offset + 0.6);
          if (nextDesc)    masterTl.fromTo(nextDesc,  { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6,  ease: 'power2.out' }, offset + 0.7);
          if (nextOrnament) masterTl.fromTo(nextOrnament, { opacity: 0, scale: 0.6 }, { opacity: 0.12, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, offset + 0.65);

          /* Lightning burst on Chapter 3 enter (index 2 → layer 3) */
          if (i === 1 && boltRef.current) {
            masterTl.fromTo(boltRef.current,
              { opacity: 0, scale: 0.6, rotation: -10 },
              { opacity: 1, scale: 1.2, rotation: 0, duration: 0.2, ease: 'power4.out' },
              offset + 0.58,
            );
            masterTl.to(boltRef.current,
              { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' },
              offset + 0.78,
            );
          }
        }
      }, sectionRef);

      return () => ctx.revert();
    }, 150);

    return () => clearTimeout(timer);
  }, [theme]);

  /* ── Mouse tracking for particle repulsion ── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Update particle positions based on distance from mouse
      particlesRef.current.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;

        const dx = particleX - e.clientX;
        const dy = particleY - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const threshold = 120; // pixels
        if (distance < threshold) {
          const angle = Math.atan2(dy, dx);
          const push = ((threshold - distance) / threshold) * 60; // repulsion strength
          el.style.transform = `translate(${Math.cos(angle) * push}px, ${Math.sin(angle) * push}px)`;
        } else {
          el.style.transform = '';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* Derived style helpers */
  const titleFont = isGujarati ? 'font-gujarati' : 'font-display';
  const bodyFont  = isGujarati ? 'font-gujarati' : '';
  
  // Use CSS variables for theme consistency and to avoid hydration mismatch
  const titleClr  = 'text-foreground';
  const bodyClr   = 'text-foreground/90';
  const subtleClr = 'text-foreground/80';

  if (!mounted) {
    return (
      <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: `${TOTAL_BLOCKS * 100}vh` }}>
        <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center">
          <div className="max-w-4xl w-full mx-4 h-[400px] rounded-[2.5rem] bg-surface/50 animate-pulse" />
        </div>
      </section>
    );
  }

  /* Softer, more ethereal Glow Orbs for atmospheric depth */
  const orbA = 'radial-gradient(circle at center, rgba(180, 140, 60, 0.45) 0%, transparent 70%)';
  const orbB = 'radial-gradient(circle at center, rgba(160, 40, 40, 0.35) 0%, transparent 70%)';

  return (
    <>
      {/* ── Component-scoped styles ── */}
      <style>{`
        /* Glow orbs */
        @keyframes sm-orb-a {
          0%,100% { transform: translate(-10%, -15%) scale(1);   }
          50%      { transform: translate(5%, 10%)   scale(1.15); }
        }
        @keyframes sm-orb-b {
          0%,100% { transform: translate(10%, 15%)  scale(1);    }
          50%      { transform: translate(-8%, -5%)  scale(1.1); }
        }
        .sm-orb-a { animation: sm-orb-a 14s ease-in-out infinite; z-index: 0; }
        .sm-orb-b { animation: sm-orb-b 18s ease-in-out infinite; z-index: 0; }

        /* Default layer state (Prevents overlap before GSAP kicks in) */
        .sm-layer {
          opacity: 0;
          pointer-events: none;
        }

        /* Continuous particle colors */
        :root {
          --sm-particle-clr: #1a1a1a; /* Sharp contrast for light theme */
        }
        [data-theme="dark"] {
          --sm-particle-clr: var(--color-gold); /* Heritage gold for dark theme */
        }

        /* Particle float */
        @keyframes sm-float {
          0%,100% { transform: translateY(0) scale(1);   opacity: 0.25; }
          50%      { transform: translateY(-30px) scale(1.4); opacity: 0.5; }
        }

        /* Particle rain — falls continuously */
        @keyframes sm-rain {
          0% {
            transform: translateY(-100vh) translateX(0);
            opacity: 0.25;
          }
          100% {
            transform: translateY(100vh) translateX(0);
            opacity: 0.25;
          }
        }

        /* Lightning bolt draw-on */
        .sm-bolt-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: sm-bolt-draw 0s linear forwards;
        }
        @keyframes sm-bolt-draw {
          to { stroke-dashoffset: 0; }
        }

        /* Progress bar */
        .sm-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg,
            var(--color-gold-light),
            var(--color-gold),
            var(--color-terracotta)
          );
          transform-origin: left center;
          border-radius: 0 0 2.5rem 2.5rem;
          z-index: 20;
        }

        /* Theater stacking grid */
        .sm-theater-grid {
          display: grid;
          grid-template-areas: "content";
          width: 100%;
          min-height: 540px; 
          align-items: center;
        }
        .sm-theater-grid > * {
          grid-area: content;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Modern robust shimmer ring using background-clip */
        .sm-card-outer {
          position: relative;
          border-radius: 2.5rem;
          padding: 3px; 
          background: linear-gradient(
            135deg,
            #AF8231,
            #EACE84,
            #9A2A2A,
            #EACE84,
            #AF8231
          );
          background-size: 300% 300%;
          animation: sm-ring-spin 10s linear infinite;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6);
        }

        @keyframes sm-ring-spin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Inner card content wrapper - uses mask for double border look OR padding */
        .sm-card-content {
          position: relative;
          border-radius: calc(2.5rem - 2px);
          overflow: hidden;
          background: var(--story-card-glass);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          min-height: inherit;
        }

        /* Gold line above card */
        .sm-top-rule {
          width: 3rem;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
          margin: 0 auto;
        }

        /* Eyebrow text */
        .sm-eyebrow {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #0e0d08, #2f2d2a);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-bottom: 0.5rem;
        }

        /* Block number badge */
        .sm-block-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid rgba(55, 212, 76, 0.4);
          font-family: var(--heading-font);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-red);
          background: rgba(212, 175, 55, 0.07);
          margin-bottom: 1rem;
        }

        /* Rotating corner mandala */
        .sm-mandala {
          position: absolute;
          color: var(--color-red);
          pointer-events: none;
          animation: sm-spin 60s linear infinite;
          z-index: 30;
        }

        @keyframes sm-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Lightning container */
        .sm-lightning {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3.5rem;
          opacity: 0;
          z-index: 30;
          pointer-events: none;
          filter: drop-shadow(0 0 16px rgba(212,175,55,0.8));
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full scroll-zone"
        style={{ height: `${TOTAL_BLOCKS * 100}vh` }}
      >
        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">

        {/* ── Ambient glow orbs (Soft blurs for depth) ── */}
        <div
          className="sm-orb-a absolute pointer-events-none"
          style={{ background: orbA, width: '120vw', height: '120vw', top: '-40%', left: '-20%', zIndex: 0, filter: 'blur(120px)' }}
          aria-hidden="true"
        />
        <div
          className="sm-orb-b absolute pointer-events-none"
          style={{ background: orbB, width: '120vw', height: '120vw', bottom: '-40%', right: '-20%', zIndex: 0, filter: 'blur(120px)' }}
          aria-hidden="true"
        />

        {/* ── Floating symbols ── */ }
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 5 }}>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-center font-display"
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                fontSize: `${p.s * 1.5}rem`,
                color: 'var(--sm-particle-clr)',
                opacity: 0.25,
                /* Splitting shorthand to avoid React warning 560:23 */
                animationName: 'sm-rain',
                animationDuration: `${p.d}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `${p.delay}s`,
                filter: 'blur(1px) drop-shadow(0 0 8px var(--color-gold-light))',
              }}
            >
              <div 
                ref={(el) => setParticleRef(el, i)}
                className="transition-transform duration-300 ease-out"
              >
                {p.char}
              </div>
            </div>
          ))}
        </div>

        {/* ── Persistent Glass Card Wrapper ── */}
        <div
          ref={cardRef}
          className="sm-card-outer relative z-10 max-w-4xl w-full mx-4 md:mx-6"
        >
          {/* Inner Content Theater (Grid Stack) */}
          <div className="sm-card-content sm-theater-grid">
            {/* Card inner radial glow */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(var(--color-gold-rgb, 175, 130, 49), 0.05) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Scroll progress bar */}
            <div ref={progressRef} className="sm-progress-track" aria-hidden="true" />

            {/* Rotating corner mandala — bottom-right */}
            <CornerMandala
              className="sm-mandala"
              style={{ bottom: '-3.5rem', right: '-3.5rem', width: '12rem', height: '12rem', opacity: 0.8, zIndex: 1 } as React.CSSProperties}
            />
            {/* Rotating corner mandala — top-left (counter-spin) */}
            <CornerMandala
              className="sm-mandala"
              style={{ top: '-3rem', left: '-3rem', width: '9rem', height: '9rem', opacity: 0.8, animationDirection: 'reverse', zIndex: 1 } as React.CSSProperties}
            />

            {/* Lightning bolt — floats over card on block 3 */}
            <div ref={boltRef} className="sm-lightning" aria-hidden="true">
              <LightningBolt className="w-full h-full" />
            </div>

            {/* ─── Text Layer 0: Grand Title ─── */}
            <div
              className="sm-layer p-10 md:p-16 lg:p-20 text-center"
              style={{ zIndex: 10 }}
            >
              <span className="sm-eyebrow">Kuvala Heritage · Chapter 4</span>

              <div className="sm-top-rule mb-5" />
              <div className="gold-line h-px w-20 bg-gold/50 mx-auto mb-0 origin-center" />

              <div className="chapter-label text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-bold mt-5 mb-5">
                {t('history.chapter')} 4
              </div>

              <div className="gold-line h-px w-20 bg-gold/50 mx-auto mb-6 origin-center" />

              {/* Ornament mandala behind title */}
              <CornerMandala
                className="sm-ornament absolute"
                style={{ width: '80%', height: '80%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, color: 'var(--color-yellow)' } as React.CSSProperties}
              />

              <h3
                className={`title-main relative z-10 text-3xl md:text-6xl font-bold mb-6 drop-shadow-2xl leading-tight ${titleFont} ${titleClr}`}
              >
                {t('history.4.storyTitle')}
              </h3>

              <p
                className={`title-sub relative z-10 text-base md:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto ${bodyFont} ${subtleClr}`}
              >
                {t('history.4.storySubtitle')}
              </p>
            </div>

            {/* ─── Text Layers 1–4: Narrative Blocks ─── */}
            {BLOCK_IDS.map((id) => (
              <div
                key={id}
                className="sm-layer p-10 md:p-16 lg:p-24 text-center"
                style={{ zIndex: 20 }}
              >
                {/* Top gold sweep bar */}
                <div
                  className="gold-bar absolute top-0 left-0 w-full h-[3.5px] origin-center"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, var(--color-gold-light) 30%, var(--color-gold) 50%, var(--color-gold-light) 70%, transparent 100%)',
                  }}
                />

                {/* Block number badge */}
                <div className="sm-block-num">{id}</div>

                {/* Eyebrow */}
                <span className="sm-eyebrow">{t('history.4.storyTitle')}</span>

                <span
                  className="phase-label text-red uppercase font-extrabold text-[9px] md:text-[11px] mb-5 block"
                  style={{ letterSpacing: '0.4em', opacity: 0 }}
                >
                  {t('history.phase')} {id}
                </span>

                {/* Ornament mandala behind block title — LARGER */}
                <CornerMandala
                  className="sm-ornament absolute"
                  style={{ width: '95%', height: '95%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.9, color: 'var(--color-yellow)' } as React.CSSProperties}
                />

                <h4
                  className={`block-title relative z-10 text-2xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight
                    ${isGujarati ? 'font-gujarati' : 'font-display uppercase tracking-tighter'}
                    ${titleClr}`}
                >
                  {t(`history.4.p${id}.title`)}
                </h4>

                {/* Decorative rule under title */}
                <div
                  style={{
                    width: '3.5rem',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                    marginBottom: '1.5rem',
                  }}
                />

                <p
                  className={`block-desc relative z-10 text-sm md:text-xl leading-relaxed md:leading-[1.7] max-w-2xl
                    ${isGujarati ? 'font-gujarati' : 'font-medium'}
                    ${bodyClr}`}
                >
                  {t(`history.4.p${id}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
