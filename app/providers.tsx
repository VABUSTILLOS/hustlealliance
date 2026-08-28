'use client';

import { MotionConfig } from 'framer-motion';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ToastProvider } from '@/app/components/ToastProvider';
import { AuthProvider } from '@/app/components/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user" — global gate: transform/layout animations
    // are stripped for users who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <I18nProvider>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </I18nProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
