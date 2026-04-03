'use client';

/**
 * useScrollHint — Scroll guidance system
 *
 * Shows a contextual scroll hint when a storytelling or horizontal-driven
 * section enters the viewport. Auto-dismisses after a timeout.
 *
 * Usage variants:
 *   mode="vertical"    → "Scroll slowly to experience" (default, icon points down)
 *   mode="horizontal"  → "Keep scrolling ↓ to navigate scenes" (icon + arrow clarifying)
 *   mode="touch"       → Same as vertical but also shown for non-touch users
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export type ScrollHintMode = 'vertical' | 'horizontal' | 'peacock';

interface UseScrollHintOptions {
  /** How long in ms to show the hint before it auto-hides (default: 4000) */
  duration?: number;
  /** Delay in ms before the hint appears after intersection (default: 600) */
  delay?: number;
  /** LocalStorage key suffix — so each section only shows once per session */
  key: string;
  /** Show only once ever (persisted) vs every visit (ephemeral / session) */
  persist?: boolean;
}

export function useScrollHint(options: UseScrollHintOptions) {
  const { duration = 4000, delay = 600, key, persist = false } = options;
  const storageKey = `kuvala-hint-${key}`;
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (persist) {
      try { localStorage.setItem(storageKey, '1'); } catch {}
    } else {
      try { sessionStorage.setItem(storageKey, '1'); } catch {}
    }
  }, [storageKey, persist]);

  const trigger = useCallback(() => {
    const storage = persist ? localStorage : sessionStorage;
    try {
      if (storage.getItem(storageKey)) return; // already shown
    } catch {}

    timerRef.current = setTimeout(() => {
      setVisible(true);
      timerRef.current = setTimeout(dismiss, duration);
    }, delay);
  }, [storageKey, persist, delay, duration, dismiss]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { visible, trigger, dismiss };
}
