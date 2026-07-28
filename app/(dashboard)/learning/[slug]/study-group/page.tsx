import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudyGroup, ensureGroupMembership } from './actions';
import { CourseStudyGroup } from '@/app/components/CourseStudyGroup';

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Auto-join group on visit (ensures group row exists + current user is a member)
  try {
    await ensureGroupMembership(slug);
  } catch {
    // User is not enrolled — redirect to course page
    redirect(`/learning/${slug}`);
  }

  // Fetch full group data once for SSR
  let group;
  try {
    group = await getStudyGroup(slug);
  } catch {
    notFound();
  }

  if (!group) {
    notFound();
  }

  const memberCount = group.members.length;
  const postCount = group.posts.length;
  const fileCount = group.files?.length ?? 0;

  return (
    <div className="min-h-screen">
      {/* Header / Breadcrumb */}
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Link
              href="/learning"
              className="hover:text-accent transition-colors"
            >
              Learning
            </Link>
            <span>/</span>
            <Link
              href={`/learning/${slug}`}
              className="hover:text-accent transition-colors"
            >
              Course
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Study Group</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">
                Study Group
              </h1>
              <p className="text-muted text-sm mt-1">
                {memberCount} member{memberCount !== 1 ? 's' : ''} in this
                group
              </p>
            </div>
            <Link
              href={`/learning/${slug}`}
              className="text-sm text-accent hover:underline"
            >
              ← Back to course
            </Link>
          </div>
        </div>
      </div>

      {/* Client component with interactive state */}
      <CourseStudyGroup courseSlug={slug} group={group} />
    </div>
  );
}
