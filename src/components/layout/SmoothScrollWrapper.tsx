'use client';

/**
 * SmoothScrollWrapper — Lenis smooth scroll with zone-aware touch damping
 *
 * Option 2: When the user enters a scrollytelling zone (.scroll-zone),
 * Lenis touchMultiplier is reduced from 1.0 → 0.35 to absorb fling momentum.
 * This prevents fast touch swipes from racing through all the narrative content.
 *
 * The .scroll-zone class should be added to any section whose content is
 * driven by scroll progress (KharaStoryScroller, PeacockSequence, StoryCards).
 * 
 * Option 4 (CSS scroll-snap) is handled via CSS on the section elements themselves
 * using the .scroll-snap-section and .scroll-snap-start utility classes defined
 * in globals.css.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Lenis from 'lenis';

/** The multiplier applied inside scroll-driven storytelling zones */
const STORY_TOUCH_MULTIPLIER = 0.38;
/** Default multiplier for normal page browsing */
const DEFAULT_TOUCH_MULTIPLIER = 1.0;
/** How long to linger in damped mode after leaving a zone (ms) */
const DAMPING_LINGER_MS = 600;

export default function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lingerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      touchMultiplier: DEFAULT_TOUCH_MULTIPLIER,
      // Prevent Lenis from consuming touch events inside elements that need their own scrolling 
      prevent: (node: Element) => node.classList.contains('lenis-prevent'),
    });

    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenisRef.current = lenis;
    (window as any).lenis = lenis;
    lenis.on('scroll', handleLenisScroll);

    /* ── RAF loop ── */
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* ── Zone-aware touch damping (Option 2) ── */
    const setMultiplier = (value: number) => {
      // Lenis exposes the option object; safe to mutate for the multiplier
      (lenis as any).options.touchMultiplier = value;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const zones = document.querySelectorAll<HTMLElement>('.scroll-zone');
      let inZone = false;

      for (const zone of zones) {
        const { top, bottom } = zone.getBoundingClientRect();
        // Within 10% tolerance of the zone
        if (top < window.innerHeight * 1.1 && bottom > -window.innerHeight * 0.1) {
          inZone = true;
          break;
        }
      }

      if (inZone) {
        if (lingerTimerRef.current) {
          clearTimeout(lingerTimerRef.current);
          lingerTimerRef.current = null;
        }
        setMultiplier(STORY_TOUCH_MULTIPLIER);
      } else {
        // Linger for a moment before restoring to avoid jarring transition
        if (!lingerTimerRef.current) {
          lingerTimerRef.current = setTimeout(() => {
            setMultiplier(DEFAULT_TOUCH_MULTIPLIER);
            lingerTimerRef.current = null;
          }, DAMPING_LINGER_MS);
        }
      }
    };

    const handleResize = () => ScrollTrigger.refresh();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', handleLenisScroll);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current);
    };
  }, []);

  return <>{children}</>;
}
