'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { getStudyGroup, ensureGroupMembership } from './actions';
import { CourseStudyGroup } from '@/app/components/CourseStudyGroup';

export function StudyGroupClient({ slug }: { slug: string }) {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState<Awaited<ReturnType<typeof getStudyGroup>>>(null);

  useEffect(() => {
    if (!user?.email) {
      setError('You must be logged in to access study groups.');
      setLoading(false);
      return;
    }

    async function init() {
      try {
        await ensureGroupMembership(user!.email!, slug);
        const data = await getStudyGroup(user!.email!, slug);
        if (!data) {
          setError('Study group not found.');
        } else {
          setGroup(data);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [slug, user?.email]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-16 bg-surface-light rounded animate-pulse" />
              <div className="h-4 w-4 bg-surface-light rounded animate-pulse" />
              <div className="h-4 w-24 bg-surface-light rounded animate-pulse" />
            </div>
            <div className="h-8 w-48 bg-surface-light rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
          <div className="h-10 w-64 bg-surface-light rounded animate-pulse" />
          <div className="h-32 bg-surface-light rounded animate-pulse" />
          <div className="h-32 bg-surface-light rounded animate-pulse" />
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

  const memberCount = group.members.length;

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

      <CourseStudyGroup courseSlug={slug} group={group} />
    </div>
  );
}
