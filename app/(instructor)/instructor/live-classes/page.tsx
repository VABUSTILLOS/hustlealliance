'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

type LiveClass = {
  id: string;
  title: string;
  description: string | null;
  course: { title: string; slug: string } | null;
  platform: string | null;
  meetingUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  maxAttendees: number | null;
  status: string;
  registrationCount: number;
};

export default function LiveClassesPage() {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = () => {
    setLoading(true);
    fetch('/api/instructor/live-classes')
      .then((r) => r.json())
      .then((data) => setClasses(data.classes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t.instructor.liveClasses.deleteConfirm)) return;
    await fetch(`/api/instructor/live-classes/${id}`, { method: 'DELETE' });
    fetchClasses();
  };

  if (loading) return <div className="p-8 text-muted">{t.general.loading}</div>;

  const upcoming = classes.filter((c) => new Date(c.startsAt) > new Date());
  const past = classes.filter((c) => new Date(c.startsAt) <= new Date());

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t.instructor.liveClasses.title}</h1>
          <p className="text-muted text-sm">{t.instructor.liveClasses.subtitle}</p>
        </div>
        <Link
          href="/instructor/live-classes/new"
          className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/80 transition-colors"
        >
          {t.instructor.liveClasses.newClass}
        </Link>
      </div>

      {/* Upcoming */}
      <h2 className="text-lg font-heading font-bold text-foreground mb-4">{t.instructor.liveClasses.upcoming}</h2>
      {upcoming.length === 0 ? (
        <p className="text-muted text-sm mb-8">{t.instructor.liveClasses.noUpcoming} <Link href="/instructor/live-classes/new" className="text-accent">{t.instructor.liveClasses.scheduleOne}</Link>.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {upcoming.map((c) => (
            <div key={c.id} className="glass-card p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground font-heading font-bold">{c.title}</h3>
                <p className="text-muted text-sm">{c.description || t.instructor.liveClasses.noDescription}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted">
                  <span>{new Date(c.startsAt).toLocaleString()}</span>
                  <span>{c.platform || t.general.tbd}</span>
                  <span>{t.instructor.liveClasses.registered.replace('{count}', String(c.registrationCount))}</span>
                  {c.course && <span>{t.instructor.liveClasses.courseLabel.replace('{title}', c.course.title)}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                {c.meetingUrl && (
                  <a href={c.meetingUrl} target="_blank" rel="noopener" className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
                    {t.instructor.liveClasses.join}
                  </a>
                )}
                <Link href={`/instructor/live-classes/new?id=${c.id}`} className="px-3 py-1.5 bg-surface-light text-muted rounded-lg text-sm hover:text-foreground">
                  {t.instructor.liveClasses.edit}
                </Link>
                <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20">
                  {t.instructor.liveClasses.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      <h2 className="text-lg font-heading font-bold text-foreground mb-4">{t.instructor.liveClasses.past}</h2>
      {past.length === 0 ? (
        <p className="text-muted text-sm">{t.instructor.liveClasses.noPast}</p>
      ) : (
        <div className="space-y-4">
          {past.map((c) => (
            <div key={c.id} className="glass-card p-6 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground font-heading font-bold">{c.title}</h3>
                  <div className="flex gap-4 mt-2 text-xs text-muted">
                    <span>{new Date(c.startsAt).toLocaleString()}</span>
                    <span>{t.instructor.liveClasses.attended.replace('{count}', String(c.registrationCount))}</span>
                  </div>
                </div>
                <span className="text-muted text-xs">{t.general.completed}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
