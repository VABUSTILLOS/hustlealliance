'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { CourseStudyGroup } from '@/app/components/CourseStudyGroup';
import type { StudyGroupWithMembers } from './actions';

const USER_INFO_KEY = 'hustle_user_info';
const AUTH_STORAGE_KEY = 'sb-yftgdtdvmvvqyzcdntge-auth-token';

function getEmailFromStorage(): string {
  if (typeof window === 'undefined') return 'guest@hustlealliance.com';
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
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.email) return payload.email;
      }
    }
  } catch { /* ignore */ }
  return 'guest@hustlealliance.com';
}

export function StudyGroupClient({
  slug,
  group,
}: {
  slug: string;
  group: StudyGroupWithMembers | null;
}) {
  const emailRef = useRef(getEmailFromStorage());
  const memberCount = (group?.members ?? []).length;

  if (!group) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Link href="/learning" className="hover:text-accent transition-colors">Learning</Link>
              <span>/</span>
              <Link href={`/learning/${slug}`} className="hover:text-accent transition-colors">Course</Link>
              <span>/</span>
              <span className="text-foreground font-medium">Study Group</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground">Study Group</h1>
                <p className="text-muted text-sm mt-1">0 members</p>
              </div>
              <Link href={`/learning/${slug}`} className="text-sm text-accent hover:underline">← Back to course</Link>
            </div>
          </div>
        </div>
        <div className="p-8 text-center text-muted">
          <p className="text-lg">Study group coming soon!</p>
          <p className="text-sm mt-2">This course&apos;s study group hasn&apos;t been created yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Link href="/learning" className="hover:text-accent transition-colors">Learning</Link>
            <span>/</span>
            <Link href={`/learning/${slug}`} className="hover:text-accent transition-colors">Course</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Study Group</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Study Group</h1>
              <p className="text-muted text-sm mt-1">{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
            </div>
            <Link href={`/learning/${slug}`} className="text-sm text-accent hover:underline">← Back to course</Link>
          </div>
        </div>
      </div>

      <CourseStudyGroup userEmail={emailRef.current} courseSlug={slug} group={group} />
    </div>
  );
}
