import type { Metadata, Viewport } from 'next';
import { fontClasses } from '@/lib/fonts';
import { I18nProvider } from '@/i18n';
import FloatingNav from '@/components/layout/FloatingNav';
import Footer from '@/components/layout/Footer';
import SmoothScrollWrapper from '@/components/layout/SmoothScrollWrapper';
import ThemeBackground from '@/components/layout/ThemeBackground';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Kuvala — Heritage, Legacy & Living Traditions',
    template: '%s | Kuvala Heritage',
  },
  description:
    'Discover the living heritage of Kuvala — ancient temples, community institutions, ancestral mind-maps, and timeless traditions preserved for generations.',
  keywords: ['Kuvala', 'heritage', 'temples', 'Gujarat', 'legacy', 'history', 'ancestors'],
  authors: [{ name: 'Shree Kuvala Jain Sangh' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'gu_IN',
    siteName: 'Kuvala Heritage',
    title: 'Kuvala — Heritage, Legacy & Living Traditions',
    description: 'Discover the living heritage of Kuvala — ancient temples and timeless traditions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuvala Heritage',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1C2333',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontClasses} antialiased`} suppressHydrationWarning>
        <I18nProvider>
          {/* Skip-to-content for accessibility */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-md focus:bg-gold focus:text-slate focus:font-semibold"
          >
            Skip to content
          </a>

          <SmoothScrollWrapper>
            <div className="relative">
              <ThemeBackground />
              <FloatingNav />

              <main id="main" className="min-h-screen">
                {children}
              </main>

              <Footer />
            </div>
          </SmoothScrollWrapper>

        </I18nProvider>
      </body>
    </html>
  );
}
