'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function GroupJoinPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !params?.token) return;
    started.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/groups/join/${params.token}`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Invalid invite link');
          return;
        }
        router.replace(`/groups/${data.slug}`);
      } catch {
        setError('Something went wrong');
      }
    })();
  }, [params?.token, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-foreground font-heading text-lg mb-2">{error}</p>
            <button
              onClick={() => router.push('/groups')}
              className="mt-4 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold"
            >
              {t.groups?.browseGroups ?? 'Browse groups'}
            </button>
          </>
        ) : (
          <>
            <div className="h-10 w-10 mx-auto mb-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-muted font-mono text-sm">
              {t.groups?.joiningGroup ?? 'Joining group…'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
