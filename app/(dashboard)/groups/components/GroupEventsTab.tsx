'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import EventCard from '@/app/(dashboard)/events/components/EventCard';
import { useEvents } from '@/app/(dashboard)/events/components/hooks/useEvents';

export function GroupEventsTab({
  groupId,
  isMember,
}: {
  groupId: string;
  isMember: boolean;
}) {
  const { data, isLoading } = useEvents({ groupId, limit: 50 });
  const events = data?.events ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
        {[0, 1].map((i) => (
          <div key={i} className="h-64 bg-surface-light rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {isMember && (
        <div className="flex justify-end">
          <Link
            href={`/events/create?groupId=${groupId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-background rounded-xl font-mono text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Event
          </Link>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-surface-light rounded-2xl">
          <div className="text-5xl mb-3">📅</div>
          <h2 className="font-display text-xl text-foreground uppercase mb-2">No events yet</h2>
          <p className="text-muted text-sm">
            {isMember
              ? 'Be the first to host an event for this space.'
              : 'This space has no upcoming events.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
