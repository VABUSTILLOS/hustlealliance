'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getStudyGroup, ensureGroupMembership } from './actions';

const USER_INFO_KEY = 'hustle_user_info';
const AUTH_STORAGE_KEY = 'sb-yftgdtdvmvvqyzcdntge-auth-token';

function getEmailFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user.email) return user.email;
    }
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (auth) {
      const session = JSON.parse(auth);
      if (session?.user?.email) return session.user.email;
      const token = session?.access_token;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload?.email) return payload.email;
        } catch { /* JWT decode failed */ }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function StudyGroupClient({ slug }: { slug: string }) {
  const hasLoaded = useRef(false);
  const emailRef = useRef<string>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState<Awaited<ReturnType<typeof getStudyGroup>>>(null);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const email = getEmailFromStorage() || `guest+${slug}@hustlealliance.com`;
    emailRef.current = email;
    loadGroup(email);

    async function loadGroup(e: string) {
      try {
        setLoading(true);
        setError(null);
        await ensureGroupMembership(e, slug);
        const data = await getStudyGroup(e, slug);
        if (!data) {
          setError('Study group not found for this course.');
        } else {
          setGroup(data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-4 bg-surface-light rounded w-3/4 mx-auto" />
          <div className="h-8 bg-surface-light rounded w-1/2 mx-auto" />
          <div className="h-32 bg-surface-light rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-bold text-red-500">Error</h1>
          <p className="text-muted mt-2">{error}</p>
          <Link href={`/learning/${slug}`} className="text-accent hover:underline mt-4 inline-block">
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-bold text-red-500">Not Found</h1>
          <p className="text-muted mt-2">This study group does not exist.</p>
          <Link href={`/learning/${slug}`} className="text-accent hover:underline mt-4 inline-block">
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1>Group loaded! {group.members.length} members</h1>
      <p>Actions work, now need CourseStudyGroup component.</p>
      <Link href={`/learning/${slug}`} className="text-accent hover:underline mt-4 inline-block">
        ← Back to course
      </Link>
    </div>
  );
}
