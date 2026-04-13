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

  const bgImage = theme === 'dark'
    ? "url('/images/backgrounds/DarkTheme_JirawalaDada.png')"
    : "url('/images/backgrounds/LightTheme_JirawalaDada.png')";

  // Determine if we are on the landing page (handling root and localized roots)
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/gu';
  
  // Apply 80% visibility on landing page vs 30% on interior pages
  const targetOpacity = theme === 'dark'
    ? (isHome ? 0.25 : 0.12)
    : (isHome ? 0.80 : 0.30);

  return (
    <motion.div
      className="fixed inset-[-10%] z-[-1] pointer-events-none"
      style={{
        backgroundImage: bgImage,
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
