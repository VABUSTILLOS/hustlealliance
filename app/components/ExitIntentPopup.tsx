'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !dismissed) {
      setVisible(true);
    }
  }, [dismissed]);

  useEffect(() => {
    // Don't show on mobile — exit intent isn't reliable
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setVisible(false), 2500);
    }, 800);
  };

  const close = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">You're in!</h3>
                  <p className="text-zinc-400 text-sm">Check your inbox for the free Fundraising 101 lesson.</p>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 mb-5">
                    <span className="text-2xl">📋</span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    Free Fundraising 101 Checklist
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    The exact term sheet checklist that helped founders raise $40M+. 
                    Drop your email and we&apos;ll send it right over — no spam, ever.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@founder.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-zinc-500 
                        focus:outline-none focus:border-accent/50 transition-all duration-200"
                      disabled={status === 'loading'}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-accent text-white font-heading font-bold text-sm
                        hover:bg-accent-glow hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all duration-300 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Me the Checklist'}
                    </button>
                  </form>

                  <p className="text-center text-[10px] text-zinc-600 mt-4">
                    No spam. Unsubscribe anytime. We respect founders&apos; time.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
