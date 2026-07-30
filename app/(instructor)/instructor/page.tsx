'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Course = {
  id: string;
  title: string;
  slug: string;
  status: string;
  thumbnail: string;
  studentCount: number;
  avgProgress: number;
  totalLessons: number;
  lastActivity: string | null;
};

export default function InstructorPage() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((r) => r.json())
      .then((data) => setCourses(data.courses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-muted">{t.general.loading}</div>;

  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.avgProgress, 0) / courses.length)
    : 0;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">{t.instructor.dashboard.title}</h1>
      <p className="text-muted text-sm mb-8">{t.instructor.dashboard.summary.replace('{count}', String(courses.length)).replace('{students}', String(totalStudents))}</p>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <p className="text-muted text-sm">{t.instructor.dashboard.courses}</p>
          <p className="text-3xl font-heading font-bold text-blue-400 mt-2">{courses.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-muted text-sm">{t.instructor.dashboard.totalStudents}</p>
          <p className="text-3xl font-heading font-bold text-purple-400 mt-2">{totalStudents}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-muted text-sm">{t.instructor.dashboard.avgProgress}</p>
          <p className="text-3xl font-heading font-bold text-green-400 mt-2">{avgProgress}%</p>
        </div>
      </div>

      {/* Course cards */}
      {courses.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">
          <p>{t.instructor.dashboard.noCourses}</p>
          <p className="text-sm mt-2">{t.instructor.dashboard.noCoursesHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/instructor/courses/${c.id}`}
              className="glass-card p-6 hover:border-accent/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-foreground font-heading font-bold group-hover:text-accent transition-colors">
                  {c.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  c.status === 'PUBLISHED' ? 'text-green-400 bg-green-400/10' :
                  c.status === 'DRAFT' ? 'text-yellow-400 bg-yellow-400/10' : 'text-muted bg-surface-light'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t.instructor.dashboard.students}</span>
                  <span className="text-foreground font-mono">{c.studentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t.instructor.dashboard.avgProgress}</span>
                  <span className="text-foreground font-mono">{c.avgProgress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t.instructor.dashboard.lessons}</span>
                  <span className="text-foreground font-mono">{c.totalLessons}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
