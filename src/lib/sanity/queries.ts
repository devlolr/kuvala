/** Lightweight GROQ tag for syntax highlighting */
const groq = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

/**
 * All GROQ queries in one place.
 * Always project only the fields you need — never use `*` on production data.
 */

/* ── Monument Queries ─────────────────────────────────────── */

/** 3 featured monuments for the home page bento grid */
export const FEATURED_MONUMENTS_QUERY = groq`
  *[_type == "heritageLocation" && featured == true] | order(_updatedAt desc)[0...3] {
    _id,
    title,
    slug,
    "period": foundedYear,
    "image": image.asset->url,
    description[0..0]
  }
`;

/** All monument slugs — used by generateStaticParams */
export const ALL_MONUMENT_SLUGS_QUERY = groq`
  *[_type == "heritageLocation"] { "slug": slug.current }
`;

/* ── Heritage Location Queries ────────────────────────────── */

/** All heritage locations for the /locations index */
export const ALL_LOCATIONS_QUERY = groq`
  *[_type == "heritageLocation"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    "image": image.asset->url,
    foundedYear
  }
`;

/** All location slugs — used by generateStaticParams */
export const ALL_LOCATION_SLUGS_QUERY = groq`
  *[_type == "heritageLocation"] { "slug": slug.current }
`;

/** Single location page — full detail */
export const LOCATION_BY_SLUG_QUERY = groq`
  *[_type == "heritageLocation" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    deity,
    foundedYear,
    managingTrust,
    location,
    excerpt,
    description,
    history,
    "image": image.asset->url,
    "gallery": gallery[].asset->url
  }
`;

/* ── Event Queries ────────────────────────────────────────── */

/** All upcoming events (date >= today) */
export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && date >= $today] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    capacity,
    excerpt,
    "image": image.asset->url
  }
`;

/* ── Ancestor / Mind-Map Queries ──────────────────────────── */

/** Full ancestor dataset for the mind-map */
export const ALL_ANCESTORS_QUERY = groq`
  *[_type == "ancestor"] {
    _id,
    "Name": name,
    "ParentID": parent->_id,
    "AlwaysVisible": alwaysVisible,
    pad
  }
`;

/* ── Quick Stats ──────────────────────────────────────────── */

export const SITE_STATS_QUERY = groq`
  {
    "monuments": count(*[_type == "monument"]),
    "locations": count(*[_type == "heritageLocation"]),
    "ancestors": count(*[_type == "ancestor"])
  }
`;
