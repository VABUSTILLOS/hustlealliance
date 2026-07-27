'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type CourseOption = { id: string; title: string };

export default function NewLiveClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get('id');

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    courseId: '',
    platform: 'zoom',
    meetingUrl: '',
    startsAt: '',
    endsAt: '',
    maxAttendees: '',
    status: 'SCHEDULED',
  });

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!existingId) return;
    fetch('/api/instructor/live-classes')
      .then((r) => r.json())
      .then((d) => {
        const existing = (d.classes || []).find((c: any) => c.id === existingId);
        if (existing) {
          setForm({
            title: existing.title,
            description: existing.description || '',
            courseId: existing.course?.id || '',
            platform: existing.platform || 'zoom',
            meetingUrl: existing.meetingUrl || '',
            startsAt: existing.startsAt ? existing.startsAt.slice(0, 16) : '',
            endsAt: existing.endsAt ? existing.endsAt.slice(0, 16) : '',
            maxAttendees: existing.maxAttendees?.toString() || '',
            status: existing.status,
          });
        }
      })
      .catch(console.error);
  }, [existingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      courseId: form.courseId || null,
      platform: form.platform,
      meetingUrl: form.meetingUrl || null,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
      status: form.status,
    };

    const method = existingId ? 'PUT' : 'POST';
    const url = existingId ? `/api/instructor/live-classes/${existingId}` : '/api/instructor/live-classes';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/instructor/live-classes');
    } else {
      alert('Failed to save. Check all fields.');
    }

    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">
        {existingId ? 'Edit Live Class' : 'New Live Class'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Class Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground placeholder:text-muted"
            placeholder="e.g. Advanced React Patterns — Session 3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground placeholder:text-muted h-24"
            placeholder="What will you cover in this session?"
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Course (optional)</label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
          >
            <option value="">No course association</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
            <input
              type="datetime-local"
              required
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
            />
          </div>
        </div>

        {/* Platform & URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
            >
              <option value="zoom">Zoom</option>
              <option value="google-meet">Google Meet</option>
              <option value="microsoft-teams">Microsoft Teams</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Meeting URL</label>
            <input
              type="url"
              value={form.meetingUrl}
              onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
              className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground placeholder:text-muted"
              placeholder="https://zoom.us/j/..."
            />
          </div>
        </div>

        {/* Max attendees */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Attendees</label>
          <input
            type="number"
            value={form.maxAttendees}
            onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
            className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
            placeholder="Leave blank for unlimited"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-3 bg-surface-light border border-white/5 rounded-lg text-foreground"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live Now</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/80 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : existingId ? 'Update Class' : 'Create Class'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-surface-light text-muted rounded-lg hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
