import Link from 'next/link';
import { getStudyGroup, ensureGroupMembership } from './actions';
import { CourseStudyGroup } from '@/app/components/CourseStudyGroup';

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let error: string | null = null;
  let group: Awaited<ReturnType<typeof getStudyGroup>> = null;

  // Auto-join group on visit
  try {
    await ensureGroupMembership(slug);
  } catch (e: unknown) {
    error = 'membership: ' + (e instanceof Error ? e.message : String(e));
  }

  // Fetch group data
  if (!error) {
    try {
      group = await getStudyGroup(slug);
      if (!group) {
        error = 'Study group not found';
      }
    } catch (e: unknown) {
      error = 'fetch: ' + (e instanceof Error ? e.message : String(e));
    }
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

  const memberCount = group!.members.length;

  return (
    <div className="min-h-screen">
      {/* Header / Breadcrumb */}
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

      {/* Client component with interactive state */}
      <CourseStudyGroup courseSlug={slug} group={group!} />
    </div>
  );
}
