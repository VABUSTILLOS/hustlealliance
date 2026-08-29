'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { formatDate } from '@/lib/utils/format-date';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';

interface LiveClassCardData {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  maxAttendees: number | null;
  meetingUrl: string | null;
  isRegistered: boolean;
  instructor: { id: string; name: string; avatar: string | null };
  course: { id: string; title: string; slug: string } | null;
  recordings: { id: string; title: string; url: string; durationSec: number | null }[];
  _count: { registrations: number };
}

type Tab = 'upcoming' | 'past';

export default function LiveClassesHubPage() {
  const { t, locale } = useTranslation();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [classes, setClasses] = useState<LiveClassCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchClasses = useCallback(async (scope: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/live-classes?scope=${scope}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setClasses(data.classes ?? []);
    } catch {
      setError(t.instructor.liveClasses.errorFailedToLoad);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchClasses(tab);
  }, [tab, fetchClasses]);

  const handleRegister = async (id: string) => {
    setRegisteringId(id);
    try {
      const res = await fetch(`/api/live-classes/${id}/register`, { method: 'POST' });
      if (!res.ok && res.status !== 409) throw new Error('Failed');
      setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, isRegistered: true } : c)));
    } catch {
      // keep current state; non-fatal
    } finally {
      setRegisteringId(null);
    }
  };

  const now = new Date();

  const fmtWhen = (iso: string) => {
    const d = new Date(iso);
    const isToday = d.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === d.toDateString();
    if (isToday) return t.instructor.liveClasses.status.live && d > now ? `${formatDate(d, { hour: 'numeric', minute: '2-digit' })}` : formatDate(d, { hour: 'numeric', minute: '2-digit' });
    if (isTomorrow) return `Tomorrow at ${d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}`;
    return formatDate(d, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const TabButton = ({ value, label }: { value: Tab; label: string }) => (
    <button
      onClick={() => setTab(value)}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        tab === value
          ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-accent/25'
          : 'text-muted hover:text-foreground hover:bg-surface-light'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t.liveClassHub.title}</h1>
          </div>
          <p className="text-muted max-w-2xl">{t.liveClassHub.subtitle}</p>

          <div className="flex items-center gap-2 mt-5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-full p-1 w-fit">
            <TabButton value="upcoming" label={t.liveClassHub.upcoming} />
            <TabButton value="past" label={t.liveClassHub.past} />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-2xl bg-[var(--color-surface)] animate-pulse" />
                ))}
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--color-border-subtle)]">
                <div className="text-4xl mb-3">{tab === 'upcoming' ? '🎥' : '📼'}</div>
                <p className="font-semibold text-lg">{tab === 'upcoming' ? t.liveClassHub.noUpcoming : t.liveClassHub.noPast}</p>
                <p className="text-muted mt-1 text-sm">{tab === 'upcoming' ? t.liveClassHub.noUpcomingDesc : t.liveClassHub.noPastDesc}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {classes.map((c) => {
                  const isLive = tab === 'upcoming' && now >= new Date(c.startsAt) && now < new Date(c.endsAt);
                  const hasRec = c.recordings.length > 0;
                  return (
                    <div
                      key={c.id}
                      className="group rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          {tab === 'upcoming' ? (
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-2">
                              {isLive ? t.instructor.liveClasses.status.live : formatDate(c.startsAt, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-muted bg-[var(--color-surface-light)] px-2 py-0.5 rounded-full mb-2">
                              {formatDate(c.startsAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                          <h3 className="font-bold text-lg leading-snug group-hover:text-accent transition-colors">
                            <Link href={`/live-classes/${c.id}`}>{c.title}</Link>
                          </h3>
                        </div>
                        {c.instructor.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.instructor.avatar} alt={c.instructor.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getInitialsAvatarUrl(c.instructor.name)} alt={c.instructor.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        )}
                      </div>

                      {c.description && (
                        <p className="text-sm text-muted line-clamp-2 mb-3">{c.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mb-4">
                        <span>{t.liveClassHub.with.replace('{name}', c.instructor.name)}</span>
                        {c.course && (
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
                            {c.course.title}
                          </span>
                        )}
                        {tab === 'upcoming' ? (
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            {t.liveClassHub.startsIn.replace('{when}', fmtWhen(c.startsAt))}
                          </span>
                        ) : hasRec ? (
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                            {t.liveClassHub.recordings.replace('{count}', String(c.recordings.length)).replace('{s}', c.recordings.length === 1 ? '' : 's')}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="text-xs text-muted">
                          {t.liveClassHub.attendees.replace('{count}', String(c._count.registrations))}
                        </span>
                        {tab === 'upcoming' ? (
                          isLive && c.meetingUrl ? (
                            <a
                              href={c.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                              {t.liveClassHub.joinNow}
                            </a>
                          ) : c.isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-surface-light)] text-muted text-sm font-semibold">
                              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                              {t.liveClassHub.registeredLabel}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegister(c.id)}
                              disabled={registeringId === c.id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-accent)]/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors disabled:opacity-50"
                            >
                              {registeringId === c.id ? '...' : t.liveClassHub.register}
                            </button>
                          )
                        ) : hasRec ? (
                          <a
                            href={c.recordings[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-accent)]/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                            {t.liveClassHub.watch}
                          </a>
                        ) : (
                          <Link
                            href={`/live-classes/${c.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-surface-light)] text-muted text-sm font-semibold hover:text-foreground transition-colors"
                          >
                            {t.liveClassHub.viewRecording}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
