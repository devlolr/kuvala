'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';

const getFooterLinks = (t: (k: string) => string) => [
  { label: t('nav.home'),       href: '/'          },
  { label: t('nav.locations'),  href: '/locations'  },
  { label: t('nav.legacy'),     href: '/legacy'     },
  { label: t('nav.events'),     href: '/events'     },
];

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="relative z-50 bg-slate border-t border-gold/20 pt-16 pb-8 scroll-snap-footer">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gold/10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-ivory font-display font-bold">
                ક
              </span>
              <div>
                <p className="font-display text-ivory text-lg font-semibold">Kuvala</p>
                <p className="text-gold/70 text-xs tracking-widest uppercase">કુવાળા</p>
              </div>
            </div>
            <p className="text-stone text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-ivory text-sm font-semibold tracking-widest uppercase mb-5">
              {t('footer.explore')}
            </h3>
            <ul className="flex flex-col gap-3">
              {getFooterLinks(t).map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-stone hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Heritage institution quick mention */}
          <div>
            <h3 className="font-display text-ivory text-sm font-semibold tracking-widest uppercase mb-5">
              {t('footer.locations')}
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: t('category.temples'), href: '/locations?category=temple' },
                { label: t('category.devasthan'), href: '/locations?category=devasthan' },
                { label: t('category.chabutro'), href: '/locations/chabutro' },
                { label: t('category.panjrapole'), href: '/locations/panjrapole' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-stone hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-stone text-xs">
          <p>© {currentYear} {t('footer.brand')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
