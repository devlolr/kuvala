import { Cinzel, Inter, Noto_Sans_Gujarati, Hind_Vadodara } from 'next/font/google';

/**
 * Cinzel — elegant serif with a classical engraved feel.
 * Used for all display headings, hero titles, section heads.
 */
export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
  preload: true,
});

/**
 * Inter — clean, modern grotesque.
 * Used for all body text, UI labels, captions.
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

/**
 * Noto Sans Gujarati — covers all Gujarati Unicode characters.
 * Used for bilingual text blocks and the language toggle.
 */
export const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-gujarati',
  display: 'swap',
  preload: false, // lazy — only needed when Gujarati is active
});

export const hindVadodara = Hind_Vadodara({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-vadodara',
  display: 'swap',
  preload: false,
});

/** Combined font class string for the root <html> element */
export const fontClasses = [
  cinzel.variable,
  inter.variable,
  notoSansGujarati.variable,
  hindVadodara.variable,
].join(' ');
