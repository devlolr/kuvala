'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/providers/ThemeProvider';

export { type Theme } from '@/providers/ThemeProvider';

export function useDarkMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a ThemeProvider');
  }
  return context;
}
