'use client';

// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Bypass: redirect to dashboard immediately since auth is mocked
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => { router.replace('/dashboard'); }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-foreground-muted text-lg animate-pulse">{t.general.redirecting}</p>
    </div>
  );
}
