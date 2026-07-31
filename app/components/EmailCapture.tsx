'use client';

import { useState, type FormEvent } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');

    // Simulate API call — replace with real endpoint when ready
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Check your inbox — lesson link sent!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@founder.com"
          required
          className="w-full px-4 py-3 min-h-[48px] rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-zinc-500 
            focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all duration-200"
          disabled={status === 'loading'}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-accent/20 border border-accent/30 text-accent font-heading font-bold text-sm
          hover:bg-accent/30 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(255,59,48,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <span className="inline-block w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        ) : (
          <>
            Get Free Lesson
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
