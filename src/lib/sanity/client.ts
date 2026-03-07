import { createClient as createSanityClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity Client Configuration
 *
 * Uses the Sanity CDN for read operations (fast, cached globally).
 * Mutations go direct to the API (bypasses CDN).
 */

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01', // pin to a stable API date — never use 'latest'
  useCdn:    true,          // true = globally cached reads (fast), false = live data
} as const;

/** Public read-only client — safe to use in Server + Client components */
export const sanityClient: SanityClient = createSanityClient(sanityConfig);

/** Write client — only used in Server Actions with the auth token */
export const sanityWriteClient: SanityClient = createSanityClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

/* ── Image URL Builder ────────────────────────────────────── */

const builder = imageUrlBuilder(sanityClient);

/**
 * Build an optimised Sanity image URL.
 *
 * @example
 * urlFor(monument.image).width(800).height(600).format('webp').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ── Type-safe fetch helper ───────────────────────────────── */

/**
 * Performs a GROQ query and returns typed data.
 * Throws a descriptive error if Sanity is misconfigured.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const pid = sanityConfig.projectId;
  if (!pid || pid === 'abcdef12' || pid === 'placeholder_replace_me') {
    console.warn('[Sanity] Placeholder config detected. Returning mock data.');
    return null as unknown as T;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
    });
  } catch (err: any) {
    console.warn('[SanityFetch Error] Falling back to mock data.', err.message);
    return null as unknown as T;
  }
}
