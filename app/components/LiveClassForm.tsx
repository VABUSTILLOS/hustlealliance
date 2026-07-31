'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useCreateLiveClass } from '@/lib/hooks/useLiveClasses';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface LiveClassFormProps {
  courseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LiveClassForm({ courseId, onSuccess, onCancel }: LiveClassFormProps) {
  const { t } = useTranslation();
  const createMutation = useCreateLiveClass();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMin, setDurationMin] = useState(60);
  const [maxAttendees, setMaxAttendees] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!date || !startTime) {
      setError('Date and start time are required');
      return;
    }

    const startsAt = new Date(`${date}T${startTime}:00`);
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

    if (endsAt <= startsAt) {
      setError('End time must be after start time');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        courseId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        maxAttendees: maxAttendees === '' ? undefined : Number(maxAttendees),
      });

      setTitle('');
      setDescription('');
      setDate('');
      setStartTime('');
      setDurationMin(60);
      setMaxAttendees('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create live class');
    }
  };

  // Get tomorrow's date as default min
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-surface-light rounded-2xl p-6 space-y-5 max-w-lg">
      <h3 className="font-display text-lg text-foreground uppercase">Schedule Live Class</h3>

      {error && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-sm text-accent">
          {error}
        </div>
      )}

      {createMutation.isSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-sm text-emerald-400">
          Live class scheduled successfully!
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.instructor.liveClasses.form.titlePlaceholder}
          className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-dim/40 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.instructor.liveClasses.form.descPlaceholder}
          rows={3}
          className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-dim/40 focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Start Time *</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Duration & Max Attendees */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Duration (min)</label>
          <select
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-heading text-foreground-dim mb-1 uppercase">Max Attendees</label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={t.instructor.liveClasses.form.unlimited}
            min={1}
            className="w-full bg-white/5 border border-surface-light rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-dim/40 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Platform info */}
      <p className="text-xs text-foreground-muted">
        Classes are hosted on Jitsi Meet — a free, open-source video platform. No downloads required.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className={clsx(
            'px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all',
            createMutation.isPending
              ? 'bg-surface-light text-foreground-dim cursor-wait'
              : 'bg-accent text-foreground hover:bg-accent-glow shadow-[0_0_20px_rgba(255,59,48,0.2)]'
          )}
        >
          {createMutation.isPending ? 'Scheduling...' : 'Schedule Class'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-surface-light text-sm text-foreground-dim hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
