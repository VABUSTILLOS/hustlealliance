import { createBrowserClient } from '@supabase/ssr';

const VALID_URL_REGEX = /^https?:\/\/.+/;

// These are public values — the anon key is the Supabase "publishable" key
// meant for client-side use. Hardcoded to bypass Vercel env var issues.
const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    console.log('[Supabase] Using URL:', url.substring(0, 50));
  }

  if (!url || !key || !VALID_URL_REGEX.test(url)) {
    console.error('[Supabase] Invalid configuration. URL:', url);
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createBrowserClient(url.trim(), key.trim());
}

/** Check whether Supabase is configured with real credentials. */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
  return !!(url && key && VALID_URL_REGEX.test(url));
}
