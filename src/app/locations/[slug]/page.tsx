import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { sanityFetch } from '@/lib/sanity/client';
import { LOCATION_BY_SLUG_QUERY, ALL_LOCATION_SLUGS_QUERY } from '@/lib/sanity/queries';

export const runtime = 'edge';

/* ── Types ─────────────────────────────────────────────────── */
interface LocationDetail {
  _id:           string;
  title:          string;
  slug:           string;
  category:       string;
  deity?:         string;
  foundedYear?:   string;
  managingTrust?: string;
  location?:      string;
  excerpt?:       string;
  image?:         string;
  gallery?:       string[];
}



/* ── Metadata ───────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = await sanityFetch<LocationDetail | null>(
    LOCATION_BY_SLUG_QUERY, { slug },
  );

  const title = location?.title ?? 'Heritage Location';
  return {
    title,
    description: location?.excerpt ?? `Explore ${title} — part of Kuvala's living heritage.`,
  };
}

/* ── Page ───────────────────────────────────────────────────── */
export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = await sanityFetch<LocationDetail | null>(
    LOCATION_BY_SLUG_QUERY, { slug },
  );

  if (!location) notFound();

  const loc: LocationDetail = location;

  const CATEGORY_ICONS: Record<string, string> = {
    temple: '🕍', devasthan: '🙏', chabutro: '🕊️', panjrapole: '🐄', other: '🏛️',
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      {/* Hero */}
      <div className="relative h-80 md:h-[28rem] bg-slate overflow-hidden">
        {loc.image ? (
          <Image
            src={loc.image}
            alt={loc.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full gradient-mesh flex items-center justify-center">
            <span className="text-8xl opacity-30" role="img" aria-hidden="true">
              {CATEGORY_ICONS[loc.category] ?? '🏛️'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/50 to-transparent" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-wide">
            <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-semibold capitalize mb-3 inline-block">
              {loc.category} · {loc.foundedYear ? `Est. ${loc.foundedYear}` : 'Kuvala'}
            </span>
            <h1 className="font-display text-ivory text-4xl-fluid font-bold">
              {loc.title}
            </h1>
            {loc.deity && (
              <p className="text-gold/80 text-sm mt-1">Dedicated to: {loc.deity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {loc.excerpt && (
              <p className="text-foreground text-lg leading-relaxed border-l-4 border-gold pl-5">
                {loc.excerpt}
              </p>
            )}

            {/* Gallery */}
            {loc.gallery && loc.gallery.length > 0 && (
              <section aria-labelledby="gallery-heading">
                <h2 id="gallery-heading" className="font-display text-earth text-2xl font-bold mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {loc.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={`${loc.title} — photo ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Info sidebar */}
          <aside>
            <div className="card-heritage p-6 sticky top-24">
              <h2 className="font-display text-earth text-lg font-bold mb-5 pb-3 border-b border-border">
                Information
              </h2>
              <dl className="flex flex-col gap-4">
                {([
                  ['Category',       loc.category],
                  ['Established',    loc.foundedYear ? `Est. ${loc.foundedYear}` : undefined],
                  ['Deity / Name',   loc.deity],
                  ['Location',       loc.location],
                  ['Managing Trust', loc.managingTrust],
                ] as [string, string | undefined][]).map(([label, value]) =>
                  value ? (
                    <div key={label}>
                      <dt className="text-stone text-xs uppercase tracking-widest mb-0.5">{label}</dt>
                      <dd className="text-foreground text-sm font-medium capitalize">{value}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
