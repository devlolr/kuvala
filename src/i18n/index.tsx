'use client';

/**
 * Kuvala Heritage — i18n (English / Gujarati) System
 *
 * Lightweight custom hook — no heavy i18n library needed.
 * Language persisted in localStorage + set on <html lang="..."> attribute.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'gu';

type I18nContextValue = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/* ── Translation Maps ──────────────────────────────────────── */

const en: Record<string, string> = {
  // Navigation
  'nav.home':       'Home',
  'nav.legacy':     'Legacy Map',
  'nav.locations':  'Locations',
  'nav.events':     'Events',

  // Hero
  'hero.tagline':         'Kuvala',
  'hero.subtitle':        'A village of living heritage, ancient temples, and timeless legacy.',
  'hero.cta.map':         'Explore the Legacy',
  'hero.cta.events':      'View Events',

  // Stats
  'stats.monuments':      'Monuments',
  'stats.history':        'Years of History',
  'stats.ancestors':      'Ancestors Documented',
  'stats.events':         'Annual Events',

  // Sections
  'section.featured':     'Featured Heritage',
  'section.legacy':       'Legacy Mind-Map',
  'section.locations':    'Heritage Locations',
  'section.events':       'Upcoming Events',

  // Legacy Map
  'map.fitView':          'Fit to View',
  'map.expand':           'Expand',
  'map.collapse':         'Collapse',
  'map.collapseAll':      'Collapse All',
  'map.loading':          'Loading heritage map…',
  'map.legendTitle':      'Hierarchy',
  'map.mainLine':         'Main Line',
  'map.branch':           'Branch',

  // Locations
  'location.overview':    'Overview',
  'location.history':     'History',
  'location.gallery':     'Gallery',
  'location.info':        'Information',
  'location.category.temple':     'Temple',
  'location.category.devasthan':  'Devasthan',
  'location.category.chabutro':   'Chabutro',
  'location.category.panjrapole': 'Panjrapole',
  'location.category.all':        'All Locations',

  // Events
  'event.register':       'Register Now',
  'event.capacity':       'Capacity',
  'event.date':           'Date',
  'event.location':       'Location',
  'event.registered':     'You\'re registered! ✓',

  // Registration form
  'form.name':            'Your Name',
  'form.email':           'Email Address',
  'form.phone':           'Phone (optional)',
  'form.message':         'Message (optional)',
  'form.submit':          'Register',
  'form.submitting':      'Registering…',
  'form.error.name':      'Name is required',
  'form.error.email':     'Valid email is required',

  // Footer
  'footer.tagline':       'Preserving the soul of Kuvala for generations to come.',
  'footer.rights':        'All rights reserved.',
};

const gu: Record<string, string> = {
  // Navigation
  'nav.home':       'ઘર',
  'nav.legacy':     'વારસો નકશો',
  'nav.locations':  'સ્થળો',
  'nav.events':     'ઉત્સવો',

  // Hero
  'hero.tagline':         'કુવાળા',
  'hero.subtitle':        'જીવંત વારસો, પ્રાચીન મંદિરો અને અમર પ્રણ ધરાવતું ગામ.',
  'hero.cta.map':         'વારસો અન્વેષો',
  'hero.cta.events':      'ઉત્સવો જુઓ',

  // Stats
  'stats.monuments':      'સ્મારકો',
  'stats.history':        'ઇતિહાસના વર્ષો',
  'stats.ancestors':      'દસ્તાવેજીકૃત પૂર્વજો',
  'stats.events':         'વાર્ષિક ઉત્સવો',

  // Sections
  'section.featured':     'વિશેષ વારસો',
  'section.legacy':       'વારસો નકશો',
  'section.locations':    'વારસો સ્થળો',
  'section.events':       'આગામી ઉત્સવો',

  // Legacy Map
  'map.fitView':          'સ્ક્રીનમાં ગોઠવો',
  'map.expand':           'વિસ્તૃત કરો',
  'map.collapse':         'સંકુચિત કરો',
  'map.collapseAll':      'બધું સંકુચિત કરો',
  'map.loading':          'વારસો નકશો લોડ થઈ રહ્યો છે…',
  'map.legendTitle':      'વંશાવલી',
  'map.mainLine':         'મુખ્ય વંશ',
  'map.branch':           'શાખા',

  // Locations
  'location.overview':    'સારાંશ',
  'location.history':     'ઇતિહાસ',
  'location.gallery':     'ગ્લૅરી',
  'location.info':        'માહિતી',
  'location.category.temple':     'મંદિર',
  'location.category.devasthan':  'દેવસ્થાન',
  'location.category.chabutro':   'ચાબૂત્રો',
  'location.category.panjrapole': 'પાંજરાપોળ',
  'location.category.all':        'બધા સ્થળો',

  // Events
  'event.register':       'નોંધણી કરો',
  'event.capacity':       'ક્ષમતા',
  'event.date':           'તારીખ',
  'event.location':       'સ્થળ',
  'event.registered':     'તમારી નોંધણી થઈ ✓',

  // Registration form
  'form.name':            'તમારું નામ',
  'form.email':           'ઈ-મેઇલ',
  'form.phone':           'ફોન (વૈકલ્પિક)',
  'form.message':         'સંદેશ (વૈકલ્પિક)',
  'form.submit':          'નોંધો',
  'form.submitting':      'નોંધણી થઈ રહી છે…',
  'form.error.name':      'નામ આવશ્યક છે',
  'form.error.email':     'માન્ય ઈ-મેઇલ આવશ્યક છે',

  // Footer
  'footer.tagline':       'આવનારી પેઢીઓ માટે કુવળાનો આત્મા સાચવીને.',
  'footer.rights':        'સર્વ અધિકાર સુરક્ષિત.',
};

const translations: Record<Language, Record<string, string>> = { en, gu };

/* ── Provider ──────────────────────────────────────────────── */

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('kuvala-lang') as Language | null;
    if (stored === 'en' || stored === 'gu') {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('kuvala-lang', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string): string =>
      translations[lang][key] ?? translations['en'][key] ?? key,
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────────────────────── */

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Toggle between English and Gujarati */
export function useLanguageToggle() {
  const { lang, setLang } = useI18n();
  return {
    lang,
    isGujarati: lang === 'gu',
    toggle: () => setLang(lang === 'en' ? 'gu' : 'en'),
  };
}
