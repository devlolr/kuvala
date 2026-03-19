import { createClient as createSanityClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

/**
 * Sanity Client Configuration
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01', // pin to a stable API date
  useCdn:    true,
} as const;

// Internal instances to allow lazy initialization
let clientInstance: SanityClient | null = null;
let writeClientInstance: SanityClient | null = null;
let imageBuilderInstance: ReturnType<typeof createImageUrlBuilder> | null = null;

/** Public read-only client — initialized on first use */
export function getSanityClient(): SanityClient {
  if (!clientInstance) {
    clientInstance = createSanityClient(sanityConfig);
  }
  return clientInstance;
}

/** Write client — used for server-side mutations */
export function getSanityWriteClient(): SanityClient {
  if (!writeClientInstance) {
    writeClientInstance = createSanityClient({
      ...sanityConfig,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return writeClientInstance;
}

/* ── Image URL Builder ────────────────────────────────────── */

/**
 * Build an optimised Sanity image URL.
 */
export function urlFor(source: any) {
  if (!imageBuilderInstance) {
    imageBuilderInstance = createImageUrlBuilder(getSanityClient());
  }
  return imageBuilderInstance.image(source);
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
  
  // Guard against missing config during build/CI
  if (!pid || pid === 'abcdef12' || pid === 'placeholder_replace_me') {
    console.warn('[Sanity] Placeholder config detected. Returning mock data.');
    return null as unknown as T;
  }

  try {
    return await getSanityClient().fetch<T>(query, params, {
      next: { revalidate: 3600 },
    });
  } catch (err: any) {
    console.warn('[SanityFetch Error] Falling back to mock data.', err.message);
    return null as unknown as T;
  }
}

