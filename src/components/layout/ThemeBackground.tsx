'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import { usePathname } from 'next/navigation';

export default function ThemeBackground() {
  const { theme } = useDarkMode();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Replaced complex wobble with a very subtle, premium parallax drift
  // The background simply moves a tiny amount vertically over the entire page length
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -20]
  );
  
  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 0]
  );

  // Add a slight spring to make the scroll transitions buttery smooth
  const y = useSpring(yTransform, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const x = useSpring(xTransform, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine if we are on the landing page (handling root and localized roots)
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/gu';

  // Numeric opacity values — Framer Motion requires real numbers, not CSS var strings.
  // Dark theme: higher opacity so the dramatic temple image reads strongly on all pages.
  // Light theme: softer on interior pages to avoid competing with content.
  const targetOpacity = theme === 'dark'
    ? (isHome ? 0.80 : 0.30)
    : (isHome ? 0.80 : 0.30);

  // Background image is driven by the CSS variable --main-bg-image, which switches
  // automatically when data-theme changes on <html>. This avoids a JS re-render lag.
  return (
    <motion.div
      className="fixed inset-[-10%] z-[-1] pointer-events-none"
      style={{
        backgroundImage: 'var(--main-bg-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        y,
        x,
      }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: targetOpacity, scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    />
  );
}
