'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video, User } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';

interface LiveClassCardProps {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  meetingUrl?: string | null;
  roomName?: string | null;
  instructor: { name: string; avatar?: string | null };
  registrationCount?: number;
  maxAttendees?: number | null;
  isRegistered?: boolean;
  onRegister?: (id: string) => Promise<void>;
  onJoin?: (id: string) => void;
}

export default function LiveClassCard({
  id,
  title,
  description,
  startsAt,
  endsAt,
  meetingUrl,
  roomName,
  instructor,
  registrationCount = 0,
  maxAttendees,
  isRegistered = false,
  onRegister,
  onJoin,
}: LiveClassCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const startsAtDate = new Date(startsAt);
  const endsAtDate = new Date(endsAt);
  const isLive = Date.now() >= startsAtDate.getTime() && Date.now() <= endsAtDate.getTime();
  const isUpcoming = Date.now() < startsAtDate.getTime();
  const isPast = Date.now() > endsAtDate.getTime();

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

  const handleRegister = async () => {
    if (!onRegister) return;
    setIsLoading(true);
    try {
      await onRegister(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative overflow-hidden rounded-xl border p-5 transition-all',
        isLive
          ? 'border-accent/30 bg-accent/5'
          : isPast
            ? 'border-surface-light bg-surface opacity-60'
            : 'border-surface-light bg-surface hover:border-white/10'
      )}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Instructor */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          {instructor.avatar ? (
            <Image src={instructor.avatar} alt={instructor.name} width={24} height={24} className="rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-muted" />
          )}
          <span className="text-xs text-muted font-body">{instructor.name}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted mb-4 line-clamp-2">{description}</p>}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(startsAtDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(startsAtDate)} – {formatTime(endsAtDate)}</span>
        </div>
        {registrationCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <Users className="w-3.5 h-3.5" />
            <span>
              {registrationCount}{maxAttendees ? ` / ${maxAttendees}` : ''} registered
            </span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div>
        {isPast ? (
          <span className="text-xs text-muted font-mono">Ended</span>
        ) : isRegistered ? (
          <button
            onClick={() => onJoin?.(id)}
            className={clsx(
              'w-full py-2.5 rounded-lg font-heading font-bold text-sm transition-all',
              isLive
                ? 'bg-accent text-foreground hover:bg-accent-glow shadow-[0_0_20px_rgba(255,59,48,0.2)]'
                : 'bg-surface-light text-muted cursor-not-allowed'
            )}
            disabled={!isLive}
          >
            {isLive ? (
              <span className="flex items-center justify-center gap-2">
                <Video className="w-4 h-4" /> Join Class
              </span>
            ) : (
              'Registered ✓'
            )}
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground-dim font-heading font-bold text-sm
              hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : isUpcoming ? 'Register' : 'Join'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
