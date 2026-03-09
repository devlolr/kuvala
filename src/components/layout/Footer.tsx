'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';

const footerLinks = [
  { label: 'Home',       href: '/'          },
  { label: 'Locations',  href: '/locations'  },
  { label: 'Legacy Map', href: '/legacy'     },
  { label: 'Events',     href: '/events'     },
];

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-slate border-t border-gold/20 pt-16 pb-8">
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
            {/* Gujarati tagline */}
            <p className="font-gujarati text-stone/60 text-xs leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-ivory text-sm font-semibold tracking-widest uppercase mb-5">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.map(({ label, href }) => (
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
              Locations
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Temples', href: '/locations?category=temple' },
                { label: 'Devasthan', href: '/locations?category=devasthan' },
                { label: 'Chabutro', href: '/locations/chabutro' },
                { label: 'Panjrapole', href: '/locations/panjrapole' },
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
          <p>© {currentYear} Shree Kuvala Jain Sangh. {t('footer.rights')}</p>
          <p className="font-gujarati text-stone/60">
            © {currentYear} કુવળા જૈન સંહ
          </p>
        </div>
      </div>
    </footer>
  );
}
