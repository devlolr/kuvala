'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';
import { useDarkMode } from '@/hooks/useDarkMode';

const navLinks = [
  { href: '/',          key: 'nav.home'      },
  { href: '/locations', key: 'nav.locations' },
  { href: '/legacy',    key: 'nav.legacy'    },
  { href: '/events',    key: 'nav.events'    },
] as const;

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  
  const pathname = usePathname();
  const { t } = useI18n();
  const { lang, toggle: toggleLanguage } = useLanguageToggle();
  const { theme, toggle: toggleTheme } = useDarkMode();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Detect scroll to show/hide nav
  useEffect(() => {
    const handleScroll = () => {
      // Invisible at the very top (e.g. within first 100px)
      setScrolledPastHero(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change safely
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 2px fixed progress bar at the top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold origin-left z-[60]"
        style={{ scaleX }}
      />

      <motion.header
        role="banner"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: scrolledPastHero ? 0 : -100, 
          opacity: scrolledPastHero ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-2 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
      >
        <div className="
            pointer-events-auto
            flex items-center justify-between
            w-full max-w-5xl
            py-3 px-6 
            bg-surface/80 backdrop-blur-md 
            border border-gold/20 shadow-lg rounded-2xl
          "
        >
          {/* Logo */}
          <Link href="/" aria-label="Kuvala Home" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-ivory font-display font-bold text-lg shadow-gold group-hover:scale-110 transition-transform duration-300">
              ક
            </span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-foreground text-base tracking-wide font-semibold">
                Kuvala
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2">
            {navLinks.map(({ href, key }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                    ${isActive
                      ? 'text-gold bg-gold/10'
                      : 'text-foreground/80 hover:text-gold hover:bg-gold/5'
                    }
                  `}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          {/* Right: Toggles + mobile menu */}
          <div className="flex items-center gap-3">
             {/* Themes Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
                className="
                  w-10 h-10 rounded-full text-foreground/80
                  hover:bg-gold/10 hover:text-gold transition-colors
                  flex items-center justify-center shrink-0
                "
              >
               {theme === 'light' ? (
                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 1-9-9z"/></svg>
               ) : (
                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
               )}
             </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label={`Switch to ${lang === 'en' ? 'Gujarati' : 'English'}`}
              className="
                w-10 h-10 rounded-full text-sm font-bold border border-gold/30
                text-foreground hover:bg-gold/10 hover:border-gold/50
                transition-all duration-200 font-gujarati
                flex items-center justify-center shrink-0
              "
            >
              {lang === 'en' ? 'ગુ' : 'EN'}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 p-2 ml-1 shrink-0"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.span animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-full bg-foreground rounded-full" />
              <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-full bg-foreground rounded-full" />
              <motion.span animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-full bg-foreground rounded-full" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 p-6 bg-surface border border-gold/20 rounded-2xl shadow-xl backdrop-blur-xl md:hidden"
          >
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">
              {t('common.navigation')}
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-foreground font-medium hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
