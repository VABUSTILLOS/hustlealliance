import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from '@/lib/supabase/config';

let _client: SupabaseClient | null = null;

/** Returns a singleton browser Supabase client. Safe to call from anywhere. */
export function createClient(): SupabaseClient {
  if (_client) return _client;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!isSupabaseConfigured()) {
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
export { isSupabaseConfigured };
