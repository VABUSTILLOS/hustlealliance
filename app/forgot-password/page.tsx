'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import NeonButton from '@/app/components/NeonButton';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/login`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="gradient-text text-3xl font-heading font-bold tracking-tight">
            Hustle Alliance
          </Link>
          <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">
            Reset your password and get back to work.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xl"
        >
          <h1 className="font-heading font-bold text-xl mb-6">Forgot password</h1>

          {error && (
            <p className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent" role="alert">
              {error}
            </p>
          )}
          {sent && (
            <p className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-500" role="status">
              If an account exists for that email, a reset link is on its way.
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="you@example.com"
            />
          </div>

          <div className="mt-6">
            <NeonButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending…' : 'Send reset link'}
            </NeonButton>
          </div>

          <div className="mt-5 text-center text-sm text-[var(--color-foreground-muted)]">
            Remembered it?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
