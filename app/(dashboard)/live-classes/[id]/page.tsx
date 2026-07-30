'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLiveClassPresence } from '@/lib/hooks/useLiveClassPresence';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';

interface LiveClassDetail {
  id: string;
  title: string;
  description: string | null;
  instructorId: string;
  platform: string;
  meetingUrl: string | null;
  roomName: string | null;
  startsAt: string;
  endsAt: string;
  maxAttendees: number | null;
  instructor: { id: string; name: string; avatar: string | null };
  course: { id: string; title: string; slug: string } | null;
  _count: { registrations: number };
}

export default function LiveClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [liveClass, setLiveClass] = useState<LiveClassDetail | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const { attendees } = useLiveClassPresence(id);

  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/live-classes/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setLiveClass(data.class);
        setIsRegistered(data.isRegistered);
        setRegistrationId(data.registrationId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load live class');
      } finally {
        setLoading(false);
      }
    }
    fetchClass();
  }, [id]);

  const handleRegister = async () => {
    // Always allow registration — the Founder profile is set as default for unauthenticated visitors
    setRegistering(true);
    try {
      const res = await fetch(`/api/live-classes/${id}/register`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setIsRegistered(true);
        setRegistrationId(data.registration.id);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !liveClass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400">{error || 'Live class not found'}</p>
        <Link href="/dashboard" className="text-primary-400 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const startsAt = new Date(liveClass.startsAt);
  const endsAt = new Date(liveClass.endsAt);
  const isLive = startsAt <= new Date() && endsAt >= new Date();
  const isPast = endsAt < new Date();
  const isFull =
    liveClass.maxAttendees != null &&
    liveClass._count.registrations >= liveClass.maxAttendees;

  const statusBadge = isLive
    ? '🔴 Live now'
    : isPast
    ? '✅ Ended'
    : '📅 Upcoming';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-white/60">
        <Link href="/dashboard" className="hover:text-white/80">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/80">Live Class</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <span className="text-sm px-3 py-1 rounded-full bg-primary-500/20 text-primary-300">
              {statusBadge}
            </span>
            <h1 className="text-2xl font-bold">{liveClass.title}</h1>
            {liveClass.course && (
              <Link
                href={`/courses/${liveClass.course.slug}`}
                className="text-primary-400 text-sm hover:underline"
              >
                📚 {liveClass.course.title}
              </Link>
            )}
            {liveClass.description && (
              <p className="text-white/70">{liveClass.description}</p>
            )}
          </div>

          {/* Register / Join button */}
          {!isPast && (
            <div className="flex-shrink-0">
              {isRegistered && liveClass.meetingUrl && isLive ? (
                <a
                  href={liveClass.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
                >
                  🎥 Join Now
                </a>
              ) : isRegistered ? (
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500/30 text-primary-200">
                  ✅ Registered
                </span>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || isFull}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
                >
                  {isFull
                    ? 'Class Full'
                    : registering
                    ? 'Registering...'
                    : 'Register Now'}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl space-y-4"
        >
          <h2 className="text-lg font-semibold">📋 Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Platform</span>
              <span>{liveClass.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Starts</span>
              <span>
                {startsAt.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                at{' '}
                {startsAt.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Ends</span>
              <span>
                {endsAt.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {liveClass.maxAttendees && (
              <div className="flex justify-between">
                <span className="text-white/60">Capacity</span>
                <span>
                  {liveClass._count.registrations} / {liveClass.maxAttendees}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 rounded-2xl space-y-4"
        >
          <h2 className="text-lg font-semibold">👤 Instructor</h2>
          <div className="flex items-center gap-3">
            <Image
              src={
                liveClass.instructor.avatar ??
                getInitialsAvatarUrl(liveClass.instructor.name)
              }
              alt={liveClass.instructor.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>{liveClass.instructor.name}</span>
          </div>

          <h2 className="text-lg font-semibold pt-2">
            👥 Attendees ({attendees.length + (isRegistered ? 1 : 0)})
          </h2>
          <div className="flex flex-wrap gap-2">
            {attendees.map((a) => (
              <Image
                key={a.userId}
                src={
                  a.avatar ||
                  getInitialsAvatarUrl(a.name)
                }
                alt={a.name}
                title={a.name}
                width={32}
                height={32}
                className="rounded-full border-2 border-primary-500/50"
              />
            ))}
            {attendees.length === 0 && (
              <p className="text-sm text-white/50">Be the first to join!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
