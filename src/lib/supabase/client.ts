import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 *
 * Use this in Client Components ('use client') and event handlers.
 * Only throws when createClient() is actually called with missing credentials,
 * so the module can be safely imported during build even before env is set.
 */

export function createClient() {
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    throw new Error(
      '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Ensure .env.local is filled in with your Supabase project credentials.',
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnon);
}
