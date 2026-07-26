import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const VALID_URL_REGEX = /^https?:\/\/.+/;

// These are public values — the anon key is the Supabase "publishable" key
// meant for client-side use. Hardcoded to bypass Vercel env var issues.
const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

let _client: SupabaseClient | null = null;

/** Returns a singleton browser Supabase client. Safe to call from anywhere. */
export function createClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

  if (!url || !key || !VALID_URL_REGEX.test(url)) {
    console.error('[Supabase] Invalid configuration. URL:', url);
    _client = createSupabaseClient('https://placeholder.supabase.co', 'placeholder-key');
    return _client;
  }

  _client = createSupabaseClient(url.trim(), key.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _client;
}

/** Check whether Supabase is configured with real credentials. */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
  return !!(url && key && VALID_URL_REGEX.test(url));
}
