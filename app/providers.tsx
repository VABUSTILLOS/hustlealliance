'use client';

import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ToastProvider } from '@/app/components/ToastProvider';
import { AuthProvider } from '@/app/components/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
