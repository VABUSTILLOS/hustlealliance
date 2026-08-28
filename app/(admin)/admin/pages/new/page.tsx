'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Convenience route: immediately creates a draft page and redirects to its editor. */
export default function NewPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Page' }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.page) router.replace(`/admin/pages/${data.page.id}/edit`);
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/pages');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <div className="p-8 text-sm text-muted">Creating page…</div>;
}
