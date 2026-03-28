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
  'nav.home':             'Home',
  'nav.locations':        'Locations',
  'nav.legacy':           'Legacy Map',
  'nav.events':           'Events',

  // Hero
  'hero.tagline':         'Kuvala',
  'hero.subtitle':        'A village of living heritage, ancient temples, and timeless legacy.',
  'hero.cta.map':         'Explore the Legacy',
  'hero.cta.events':      'View Events',
  'hero.tagline.secondary': 'Kuvala Village — Knowledge, Devotion and Legacy',
  'hero.invocation': '।। Parmatma Shree Parshva, Sambhav, Shanti, Vardhaman, and Munisuvrat Swami Namah ।।',
  'hero.lineage': '।। P. Pu. Satya-Kapoor-Kshama-Jin-Uttam-Padma-Rup-Ami-Saubhagya-Ratna-Mohan-Dharma-Surendra-Ravi-Ram Surishwarji Namah ।।',

  // Stats
  'stats.monuments':      'Monuments',
  'stats.history':        'Years of History',
  'stats.ancestors':      'Ancestors Documented',
  'stats.events':         'Annual Events',

  // Sections
  'section.featured':     'Featured Heritage',
  'section.featured.eyebrow': 'Heritage Highlights',
  'section.featured.subtitle': 'Centuries of devotion, culture, and community — preserved in stone, memory, and living tradition.',
  'section.legacy':       'Legacy Mind-Map',
  'section.locations':    'Heritage Locations',
  'section.events':       'Upcoming Events',

  // Common labels
  'common.explore':       'Explore',
  'common.viewAll':       'View All Heritage Locations',
  'common.navigation':    'Navigation',
  'common.rights':        'All rights reserved.',
  'common.scroll':        'Scroll',

  // Footer
  'footer.brand':         'Shree Kuvala Jain Sangh',
  'footer.explore':       'Explore',
  'footer.locations':     'Locations',
  'footer.tagline':       'Preserving the soul of Kuvala for generations to come.',
  'footer.rights':        'All rights reserved.',

  // Categories
  'category.temples':      'Temples',
  'category.devasthan':    'Devasthan',
  'category.chabutro':     'Chabutro',
  'category.panjrapole':   'Panjrapole',

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
};

const gu: Record<string, string> = {
  // Navigation
  'nav.home':             'મુખ્ય પૃષ્ઠ',
  'nav.locations':        'વારસો સ્થળો',
  'nav.legacy':           'વારસો નકશો',
  'nav.events':           'ઉત્સવો',

  // Hero
  'hero.tagline':         'કુવાળા',
  'hero.subtitle':        'જીવંત વારસો, પ્રાચીન મંદિરો અને અમર પ્રણ ધરાવતું ગામ.',
  'hero.cta.map':         'વારસો અન્વેષો',
  'hero.cta.events':      'ઉત્સવો જુઓ',
  'hero.tagline.secondary': 'કુવાળા ગ્રામ — જ્ઞાન, ભક્તિ અને વારસો',
  'hero.invocation': '।। પરમાત્માશ્રી પાર્શ્વ-સંભવ-આદિ-શાંતિ-વર્ધમાન-મુનિસુવ્રતસ્વામિને નમો નમઃ ।।',
  'hero.lineage': '।। પ.પૂ.સત્ય-કપૂર-ક્ષમા-જિન-ઉત્તમ-પદ્મ-રૂપ-અમી-સૌભાગ્ય-રત્ન-મોહન-ધર્મ-સુરેન્દ્ર-રવિ-રામસૂરીશ્વરજી સદ્ગુરુભ્યો નમઃ ।।',

  // Stats
  'stats.monuments':      'સ્મારકો',
  'stats.history':        'ઇતિહાસના વર્ષો',
  'stats.ancestors':      'દસ્તાવેજીકૃત પૂર્વજો',
  'stats.events':         'વાર્ષિક ઉત્સવો',

  // Sections
  'section.featured':     'વિશેષ વારસો',
  'section.featured.eyebrow': 'વારસોની મુખ્ય ઝલક',
  'section.featured.subtitle': 'સદીઓની ભક્તિ, સંસ્કૃતિ અને સમુદાય — પથ્થર, સ્મૃતિ અને જીવંત પરંપરામાં સચવાયેલ છે.',
  'section.legacy':       'વારસો નકશો',
  'section.locations':    'વારસો સ્થળો',
  'section.events':       'આગામી ઉત્સવો',

  // Common labels
  'common.explore':       'અન્વેષો',
  'common.viewAll':       'બધા વારસો સ્થળો જુઓ',
  'common.navigation':    'નેવિગેશન',
  'common.rights':        'સર્વ અધિકાર સુરક્ષિત.',
  'common.scroll':        'સ્ક્રોલ કરો',

  // Footer
  'footer.brand':         'શ્રી કુવાળા જૈન સંઘ',
  'footer.explore':       'અન્વેષો',
  'footer.locations':     'સ્થળો',
  'footer.tagline':       'કુવાળા હેરિટેજ — વર્ષોની ભક્તિ દ્વારા આપણી કાલાતીત આધ્યાત્મિકતાનું રક્ષણ.',
  'footer.rights':        'સર્વ અધિકાર સુરક્ષિત.',

  // Categories
  'category.temples':      'મંદિરો',
  'category.devasthan':    'દેવસ્થાન',
  'category.chabutro':     'ચબૂતરો',
  'category.panjrapole':   'પાંજરાપોળ',

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
