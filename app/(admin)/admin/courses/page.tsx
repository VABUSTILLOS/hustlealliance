'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Course = {
  id: string;
  title: string;
  slug: string;
  status: string;
  difficulty: string;
  accessLevel: string;
  price: number;
  studentCount: number;
  instructor: { name: string } | null;
  category: { name: string } | null;
  _count: { enrollments: number; modules: number };
};

export default function AdminCoursesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/courses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, [search, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(t.admin.courses.deleteConfirm.replace('{title}', title))) return;
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
  };

  const statusColors: Record<string, string> = {
    PUBLISHED: 'text-green-400 bg-green-400/10',
    DRAFT: 'text-yellow-400 bg-yellow-400/10',
    ARCHIVED: 'text-muted bg-surface-light',
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t.admin.courses.title}</h1>
          <p className="text-muted text-sm mt-1">{t.admin.courses.totalCourses.replace('{total}', String(total))}</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="px-4 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          {t.admin.courses.newCourse}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder={t.admin.courses.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        >
          <option value="">{t.admin.courses.filterAllStatus}</option>
          <option value="PUBLISHED">{t.admin.courses.filterPublished}</option>
          <option value="DRAFT">{t.admin.courses.filterDraft}</option>
          <option value="ARCHIVED">{t.admin.courses.filterArchived}</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card p-8 text-center text-muted">{t.admin.common.loading}</div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">{t.admin.courses.noCourses}</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left border-b border-surface-light">
                <th className="p-4 font-medium">{t.admin.courses.table.title}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.status}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.difficulty}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.access}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.enrollments}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.price}</th>
                <th className="p-4 font-medium">{t.admin.courses.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-surface-light/50 hover:bg-surface-light/20">
                  <td className="p-4">
                    <p className="text-foreground font-medium">{c.title}</p>
                    <p className="text-muted text-xs">/{c.slug}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || 'text-muted'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted capitalize">{c.difficulty.toLowerCase()}</td>
                  <td className="p-4 text-muted">{c.accessLevel}</td>
                  <td className="p-4 text-muted">{c._count.enrollments}</td>
                  <td className="p-4 text-muted">${c.price || 0}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/courses/${c.id}`)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-surface-light text-foreground hover:bg-accent/10 transition-colors"
                      >
                        {t.admin.common.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                      >
                        {t.admin.common.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
