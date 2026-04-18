'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useI18n, useLanguageToggle } from '@/i18n';

import { useDarkMode } from '@/hooks/useDarkMode';

const navLinks = [
  { href: '/',          key: 'nav.home'      },
  { href: '/locations', key: 'nav.locations' },
  { href: '/legacy',    key: 'nav.legacy'    },
  { href: '/events',    key: 'nav.events'    },
] as const;

export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  const pathname  = usePathname();
  const { t }     = useI18n();
  const { lang, toggle: toggleLanguage } = useLanguageToggle();
  const { theme, toggle: toggleTheme } = useDarkMode();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Auto-hide navbar on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Don't hide if at the very top, or if mobile menu is open
    if (latest > previous && latest > 150 && !isOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial state based on current scroll position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change safely
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        role="banner"
        className={`
          fixed top-0 inset-x-0 z-50
          transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className={`
          transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-full
          ${scrolled 
            ? 'py-2 md:py-3 shadow-md bg-surface/90 backdrop-blur-xl border-b border-border' 
            : 'py-4 md:py-6 bg-transparent border-transparent'
          }
        `}>
          <div className="container-wide flex items-center justify-between">
            {/* Logo */}
          <Link href="/" aria-label="Kuvala Heritage Home" className="flex items-center gap-3 md:gap-4 group">
            <span className={`
              rounded-full gradient-gold flex items-center justify-center font-display font-bold shadow-gold group-hover:scale-110 transition-all duration-300
              ${scrolled ? 'w-9 h-9 text-base' : 'w-10 h-10 md:w-11 md:h-11 text-lg'}
              ${!scrolled ? 'text-white' : 'text-ivory'}
            `}>
              ક
            </span>
            <div className="flex flex-col leading-tight transition-all duration-300">
              <span className={`font-display font-semibold tracking-wide transition-colors duration-300 ${!scrolled ? 'text-white drop-shadow-md' : 'text-ivory'} ${scrolled ? 'text-base' : 'text-lg'}`}>
                Kuvala
              </span>
              <span className={`text-[10px] md:text-xs tracking-widest uppercase transition-colors duration-300 ${!scrolled ? 'text-white/90 drop-shadow-md' : 'text-gold/80'}`}>
                કુવાળા
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map(({ href, key }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-200
                    ${isActive
                      ? (!scrolled ? 'text-white drop-shadow-md' : 'text-gold')
                      : (!scrolled ? 'text-white/80 hover:text-white drop-shadow-md' : 'text-parchment/80 hover:text-gold')
                    }
                  `}
                >
                  {t(key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full ${!scrolled ? 'bg-white' : 'bg-gold'}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language toggle + mobile menu */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Themes Toggle */}
            <button
               onClick={toggleTheme}
               aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
               className={`
                 w-9 h-9 md:w-10 md:h-10 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0
                 ${!scrolled ? 'border-white/40 text-white hover:bg-white hover:text-black backdrop-blur-sm' : 'border-gold/40 text-gold hover:bg-gold hover:text-slate'}
               `}
            >
              {theme === 'light' ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 1-9-9z"/></svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              )}
            </button>

            {/* Language Toggle */}
            <button
              id="lang-toggle"
              onClick={toggleLanguage}
              aria-label={`Switch to ${lang === 'en' ? 'Gujarati' : 'English'}`}
              className={`
                w-9 h-9 md:w-10 md:h-10 rounded-full text-sm font-bold border-2 transition-all duration-300 font-gujarati flex items-center justify-center shrink-0
                ${!scrolled ? 'border-white/40 text-white hover:bg-white hover:text-black backdrop-blur-sm' : 'border-gold/40 text-gold hover:bg-gold hover:text-slate'}
              `}
            >
              {lang === 'en' ? 'ગુ' : 'EN'}
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(v => !v)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 p-2 shrink-0"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className={`block h-0.5 w-full rounded-full transition-colors ${!scrolled ? 'bg-white' : 'bg-gold'}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                className={`block h-0.5 w-full rounded-full transition-colors ${!scrolled ? 'bg-white' : 'bg-gold'}`}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className={`block h-0.5 w-full rounded-full transition-colors ${!scrolled ? 'bg-white' : 'bg-gold'}`}
              />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-slate/70 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.nav
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              aria-label="Mobile navigation"
              className="
                fixed top-0 right-0 bottom-0 z-50
                w-72 glass-dark border-l border-gold/20
                flex flex-col pt-20 pb-8 px-6
                md:hidden
              "
            >
              <p className="text-gold/60 text-xs uppercase tracking-widest mb-6">{t('common.navigation')}</p>
              <ul className="flex flex-col gap-1">
                {navLinks.map(({ href, key }) => {
                  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                          transition-all duration-200
                          ${isActive
                            ? 'bg-gold/15 text-gold border border-gold/30'
                            : 'text-parchment/80 hover:bg-white/5 hover:text-gold'
                          }
                        `}
                      >
                        {t(key)}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 bg-gold rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-6 border-t border-gold/20">
                <p className="text-stone text-xs text-center">
                  Kuvala Heritage © 2024
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
