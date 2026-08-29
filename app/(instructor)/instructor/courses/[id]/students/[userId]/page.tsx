'use client';

import { useState, useEffect, use } from 'react';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/useTranslation';

type LessonDetail = {
  lessonId: string;
  title: string;
  moduleTitle: string;
  sortOrder: number;
  completed: boolean;
  completedAt: string | null;
  videoPosition: number;
  lastAccessedAt: string | null;
};

type StudentDetail = {
  student: { name: string; email: string; avatar: string | null };
  course: { title: string; slug: string };
  lessons: LessonDetail[];
  progressPct: number;
};

export default function StudentDetailPage({ params }: { params: Promise<{ id: string; userId: string }> }) {
  const { t } = useTranslation();
  const { id, userId } = use(params);
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/instructor/courses/${id}/students?studentId=${userId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, userId]);

  if (loading) return <div className="p-8 text-muted">{t.instructor.courses.studentDetail.loading}</div>;
  if (!data) return <div className="p-8 text-muted">{t.instructor.courses.studentDetail.notFound}</div>;

  // Group lessons by module
  const modules = new Map<string, LessonDetail[]>();
  data.lessons.forEach((l) => {
    if (!modules.has(l.moduleTitle)) modules.set(l.moduleTitle, []);
    modules.get(l.moduleTitle)!.push(l);
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/instructor/courses/${id}`} className="text-muted hover:text-foreground">{t.instructor.courses.studentDetail.backToStudents}</Link>
      </div>

      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={data.student.avatar || getInitialsAvatarUrl(data.student.name)}
            alt={data.student.name}
            width={48}
            height={48}
            className="rounded-full border-2 border-white/10"
          />
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">{data.student.name}</h1>
            <p className="text-muted text-sm">{data.student.email}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-muted text-xs">{t.instructor.courses.studentDetail.course}</p>
            <p className="text-foreground text-sm">{data.course.title}</p>
          </div>
          <div>
            <p className="text-muted text-xs">{t.instructor.courses.studentDetail.progress}</p>
            <p className="text-foreground text-sm font-mono">{data.progressPct}%</p>
          </div>
          <div>
            <p className="text-muted text-xs">{t.instructor.courses.studentDetail.lessonsComplete}</p>
            <p className="text-foreground text-sm font-mono">{data.lessons.filter((l) => l.completed).length}/{data.lessons.length}</p>
          </div>
        </div>
      </div>

      {/* Lesson progress by module */}
      <div className="space-y-6">
        {Array.from(modules.entries()).map(([moduleTitle, lessons]) => (
          <div key={moduleTitle} className="glass-card p-6">
            <h3 className="text-foreground font-heading font-bold mb-4">{moduleTitle}</h3>
            <div className="space-y-2">
              {lessons.map((l) => (
                <div key={l.lessonId} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-light/30">
                  <div className="flex items-center gap-3">
                    <span className={l.completed ? 'text-green-400' : 'text-muted'}>
                      {l.completed ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-sm ${l.completed ? 'text-foreground' : 'text-muted'}`}>
                      {l.title}
                    </span>
                  </div>
                  <div className="text-right">
                    {l.completed ? (
                      <span className="text-green-400 text-xs">{new Date(l.completedAt!).toLocaleDateString()}</span>
                    ) : l.lastAccessedAt ? (
                      <span className="text-muted text-xs">{t.instructor.courses.studentDetail.lastActive}: {new Date(l.lastAccessedAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-muted text-xs">{t.instructor.courses.studentDetail.notStarted}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
