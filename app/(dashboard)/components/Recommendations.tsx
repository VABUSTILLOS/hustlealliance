'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Recommendation = {
  interests: string[];
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    tagline: string | null;
    thumbnail: string | null;
    difficulty: string | null;
    accessLevel: string;
    category: { name: string } | null;
  }>;
  spaces: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    avatar: string | null;
    memberCount: number;
  }>;
  events: Array<{
    id: string;
    title: string;
    slug: string;
    type: string;
    startDate: string;
    location: string | null;
    isFeatured: boolean;
  }>;
};

export default function Recommendations() {
  const [data, setData] = useState<Recommendation | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/recommendations')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null;
  if (!data) {
    return (
      <div className="h-24 flex items-center justify-center">
        <span className="animate-pulse text-sm text-foreground-muted">Loading recommendations…</span>
      </div>
    );
  }

  const hasAny = data.courses.length > 0 || data.spaces.length > 0 || data.events.length > 0;
  if (!hasAny) return null;

  const dateFmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-display text-lg text-foreground uppercase tracking-wide">
          ✨ Recommended for you
        </h2>
        {data.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.interests.map((t) => (
              <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-foreground-dim bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Courses */}
        {data.courses.length > 0 && (
          <div className="glass-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted mb-3">Courses</p>
            <div className="space-y-3">
              {data.courses.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/learning/${c.slug}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-light shrink-0">
                    {c.thumbnail ? (
                      <Image src={c.thumbnail} alt="" width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">🎓</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-accent transition-colors">{c.title}</p>
                    {c.tagline && <p className="text-xs text-foreground-muted truncate">{c.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Spaces */}
        {data.spaces.length > 0 && (
          <div className="glass-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted mb-3">Spaces</p>
            <div className="space-y-3">
              {data.spaces.map((s) => (
                <Link key={s.id} href={`/spaces/${s.slug}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-light shrink-0">
                    {s.avatar ? (
                      <Image src={s.avatar} alt="" width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">💬</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-accent transition-colors">{s.name}</p>
                    <p className="text-xs text-foreground-muted">{s.memberCount.toLocaleString()} members</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {data.events.length > 0 && (
          <div className="glass-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted mb-3">Upcoming events</p>
            <div className="space-y-3">
              {data.events.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-mono shrink-0">
                    {dateFmt.format(new Date(e.startDate))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-accent transition-colors">
                      {e.isFeatured ? '⭐ ' : ''}{e.title}
                    </p>
                    {e.location && <p className="text-xs text-foreground-muted truncate">{e.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
