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

  // History
  'history.1.title': 'A Village Like Gokul',
  'history.1.desc': 'Kuvala — a beautiful village where peacocks sing morning and evening, and the soil is fragrant with the pure character of great souls.',
  'history.2.title': 'The Divine Discovery',
  'history.2.desc': 'Excavations in Khara village revealed ancient idols of Shree Sambhavnath, Ajitnath, and Padmaprabh. Guided by divinity, the cart bringing them naturally turned towards Kuvala.',
  'history.2.p1.title': 'Scene I — The Discovery',
  'history.2.p1.desc': 'Deep in the dry earth of a Khara village farm, a divine secret waited. During a routine excavation, the soil gave way to reveal a sacred Trigadu — three magnificent, pristine idols of Shri Sambhavnath Dada, Shri Ajitnath Dada, and Shri Padmaprabha Swami, miraculously appearing from the dust.',
  'history.2.p2.title': 'Scene II — The Dilemma',
  'history.2.p2.desc': 'Word of the divine appearance spread rapidly. Since Khara had no Jain population, the devoted Sanghs of both Kuwala and Bhabhar hurried to the fields. A profound question stood before the elders: which village would be blessed with the honour of taking the Paramatma home?',
  'history.2.p3.title': 'Scene III — The Pact of Surrender',
  'history.2.p3.desc': 'Human debate gave way to absolute faith. The leaders agreed to let the divine choose. They brought a sturdy cart from the Bhabhar Mahajan and yoked it to the powerful oxen of the Kuwala Mahajan. The Lords were respectfully seated, and the reins were left untouched.',
  'history.2.p4.title': 'Scene IV — The Divine Choice',
  'history.2.p4.desc': 'As the heavy wooden wheels groaned and the oxen stepped forward, the gathered crowd held its breath. At the fork in the road, without a single command, the cart made its choice — turning decisively onto the dusty path leading toward Kuwala.',
  'history.2.p5.title': 'Scene V — The Welcoming',
  'history.2.p5.desc': 'Joy echoed through the stone gates of Kuwala. The Lords had chosen their sanctuary. The villagers welcomed the divine procession with open hearts, flowers, and deep reverence, forever cementing their village\'s place in history.',
  'history.2.p6.title': 'The Living Miracle',
  'history.2.p6.desc': 'Today, the sacred Trigadu rests peacefully in Kuwala. Devotees who come with unwavering focus speak of a beautiful, enduring miracle: depending on the hour, the Paramatma subtly reflects the cycle of life — appearing as a child in the soft morning light, a youth in the afternoon sun, and a serene elder as evening falls.',
  'history.3.title': 'Eradicating Kanya Vikray',
  'history.3.desc': 'A powerful social reform initiated by Guru Maharaj saved 17 villages from the grave sin of "Kanya Vikray" and stopped wasteful wedding expenses.',
  'history.4.title': 'The Storm Miracle',
  'history.4.desc': 'During the temple renovation, a fierce storm struck. The Guru foresaw the danger and ordered everyone out of the trench just in time, saving all lives.',
  'history.5.title': 'The Chariot Entry',
  'history.5.desc': 'When the engine of the carriage mysteriously stopped at the village entrance, the Guru was seated in the silver chariot instead, fulfilling the divine will.',
  'history.6.title': "The Peacock's Evening Aarti",
  'history.6.desc': "In a mesmerizing nightly miracle, a peaceful peacock—a symbol of good omens (Shakun)—graces the Shikhar exactly during the evening prayer and stays there throughout the night in deep, silent devotion to the Paramatma.",

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

  // History
  'history.1.title': 'ગોકુળ જેવું સુંદર નગર',
  'history.1.desc': 'ગોકુળ જેવું સુંદર નગર એટલે કુવાળા... જ્યાં સવાર સાંજ શુભપક્ષી એટલે કે મોર ટહુકરતા રહે છે અને જે ધરતીની માટી મહાપુરુષોના શુદ્ધ ચારિત્રની સુવાસથી મહેકતી રહે છે.',
  'history.2.title': 'અલૌકિક પ્રાગટ્ય',
  'history.2.desc': 'ખારા ગામનાં ખેતર વિસ્તારમાં ખોદકામ દરમ્યાન શ્રી સંભવનાથદાદા-શ્રી અજિતનાથદાદા તથા શ્રી પદ્મપ્રભસ્વામીનું ત્રિગડુ પ્રગટ થયેલ... ગાડું કુવાળા તરફ વળ્યું.',
  'history.2.p1.title': 'પ્રસંગ ૧ — અલૌકિક પ્રાગટ્ય',
  'history.2.p1.desc': 'ખારા ગામનાં ખેતર વિસ્તારમાં ખોદકામ દરમ્યાન અલૌકિક તેજપુંજ સમાન ત્રિગડુ પ્રગટ થયું. ધૂળથી ઢંકાયેલી શ્રી સંભવનાથદાદા, શ્રી અજિતનાથદાદા અને શ્રી પદ્મપ્રભસ્વામીની પાવન મૂર્તિઓ ભૂમિ ભેટ થઈ.',
  'history.2.p2.title': 'પ્રસંગ ૨ — ગહન વિચાર-વિમર્શ',
  'history.2.p2.desc': 'ખારા ગામમાં જૈન સમાજ ન હોવાથી, કુવાળા અને ભાભર — બન્ને જૈન સંઘ ત્યાં પહોંચ્યા. ભારે હૈયે સૌ વિચારવા લાગ્યા: ભગવાન ક્યા ગામ પધારશે?',
  'history.2.p3.title': 'પ્રસંગ ૩ — અનોખો નિર્ણય',
  'history.2.p3.desc': 'ગાડું ભાભર મહાજનનું, બળદ કુવાળા મહાજનના. ભગવાનને ગાડામાં બિરાજમાન કર્યા — અને નક્કી કર્યું કે ગાડું જ્યાં જાય ત્યાં ભગવાન પધારશે.',
  'history.2.p4.title': 'પ્રસંગ ૪ — એ ઐતિહાસિક વળાંક',
  'history.2.p4.desc': 'ભારે પૈડાં ગડગડ્યાં, બળદ આગળ ધપ્યા, સૌ શ્વાસ રોકી ઊભા. ચૌટા પર ગાડું — અને ત્યારે... સ્વયં ઈશ્વરની ઇચ્છાથી, ગાડું કુવાળા ભણી વળ્યું!',
  'history.2.p5.title': 'પ્રસંગ ૫ — ભવ્ય સ્વાગત',
  'history.2.p5.desc': 'કુવાળાના દ્વારે ઉત્સવ છવાઈ ગયો. ફૂલોની વૃષ્ટિ, જયઘોષ, અને ભક્તોના ભાવ — ભગવાન પધાર્યા. કુવાળા ધન્ય બન્યું!',
  'history.2.p6.title': 'જીવંત ચમત્કાર',
  'history.2.p6.desc': 'આજે ત્રિગડુ કુવાળામાં સ્થિત છે. ભક્તો ના\'ધ્યું છે — સવારે ભગવાન બાળ જેવા, બપોરે યુવાન, ને સાંજે પ્રૌઢ જેવા ભાસે. જીવনના ઉષ:કાળ થી અસ્ત સુધી — ભગવાન સૌની સાથે!',
  'history.3.title': 'કન્યા વિક્રય નિષેધ',
  'history.3.desc': 'ગુરુદેવના ઉપદેશથી 17 ગામોને કન્યા વિક્રય જેવા મહાપાપથી બચાવ્યા અને લગ્ન પ્રસંગોમાં થતા ખોટા ખર્ચાઓને અટકાવ્યા.',
  'history.4.title': 'વાવાઝોડાનો ચમત્કાર',
  'history.4.desc': 'ભયંકર વાવાઝોડું ચાલું થયું દેરાસરની બોર્ડર બનાવેલા પતરાઓ ઉડવા લાગ્યા... પણ જ્ઞાની ગુરુની સમયસૂચકતાના કારણે બધા બચી ગયા.',
  'history.5.title': 'રથમાં પધરામણી',
  'history.5.desc': 'કુવાળા નગરનો પ્રવેશદ્વાર આવતા જ બગીનું એન્જિન બંધ થઈ ગયું... સદ્ગુરુદેવ રથમાં બિરાજમાન થયા અને શ્રાવકોએ સ્વયં ચલાવી પ્રવેશ કરાવ્યો.',
  'history.6.title': 'મોરલાની આરતી',
  'history.6.desc': 'સાંજની આરતીના સમયે શિખર પર મોરલાનું આગમન થાય છે, જે પરમાત્મા પ્રત્યેની અપાર ભક્તિનું જીવંત અને અલૌકિક ઉદાહરણ છે.',

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
