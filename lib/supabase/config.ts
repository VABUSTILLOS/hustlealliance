/**
 * Shared Supabase configuration resolver.
 *
 * These are public values — the anon key is the Supabase "publishable" key
 * meant for client-side use. Env vars take priority, but placeholder /
 * scrubbed values (e.g. the literal `[SENSITIVE]` written by some secrets
 * tooling) are treated as unset so we fall back to the committed defaults.
 */

const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

const VALID_URL_REGEX = /^https?:\/\/.+/;
const PLACEHOLDER_REGEX = /^\[SENSITIVE\]$|^your-|^placeholder|^xxx/i;

function resolveValue(envName: string, fallback: string): string {
  const value = process.env[envName];
  if (!value) return fallback;
  if (PLACEHOLDER_REGEX.test(value)) return fallback;
  return value;
}

export function getSupabaseUrl(): string {
  return resolveValue('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return resolveValue('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
}

/** Whether the resolved config points at a real Supabase project. */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return !!url && !!key && VALID_URL_REGEX.test(url);
}
