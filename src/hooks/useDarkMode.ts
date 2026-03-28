'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Evaluates current theme priority: User Override > System Default
    const evaluateTheme = () => {
      const saved = localStorage.getItem('kuvala-theme') as Theme | null;
      
      if (saved) {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        const systemPref = mediaQuery.matches ? 'dark' : 'light';
        setTheme(systemPref);
        document.documentElement.setAttribute('data-theme', systemPref);
      }
    };

    // Initial check on mount
    evaluateTheme();

    // Listener for system preference changes (e.g., sunset triggers OS Dark Mode)
    const handleChange = () => {
      // Only auto-adjust if the user hasn't forced their own override
      if (!localStorage.getItem('kuvala-theme')) {
        evaluateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('kuvala-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return { theme, toggle };
}
