"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useCreateEvent } from "./hooks/useEvents";
import type { EventType } from "@/lib/generated/prisma/client";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EventCreator() {
  const { t } = useTranslation();
  const router = useRouter();
  const createMutation = useCreateEvent();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType>("ONLINE");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [error, setError] = useState("");

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  }, [slug, title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !slug || !startDate || !startTime) {
      setError(t.events?.form?.requiredFields ?? "Please fill in all required fields");
      return;
    }

    const startDt = new Date(`${startDate}T${startTime}:00`);
    let endDt: Date | undefined;
    if (endDate && endTime) {
      endDt = new Date(`${endDate}T${endTime}:00`);
    }

    try {
      const event = await createMutation.mutateAsync({
        title,
        slug,
        description: description || undefined,
        type,
        location: location || undefined,
        startDate: startDt.toISOString(),
        endDate: endDt?.toISOString(),
        coverImage: coverImage || undefined,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      });
      router.push(`/events/${event.slug}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const typeOptions: { value: EventType; label: string; icon: string }[] = [
    { value: "ONLINE", label: t.events?.type?.online ?? "Online", icon: "🎥" },
    { value: "IN_PERSON", label: t.events?.type?.inPerson ?? "In Person", icon: "📍" },
    { value: "HYBRID", label: t.events?.type?.hybrid ?? "Hybrid", icon: "🔄" },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.title ?? "Event Title"} *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder={t.events?.form?.titlePlaceholder ?? "e.g. Founder Pitch Night"}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.slug ?? "URL Slug"} *
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2.5 bg-[var(--color-border-subtle)] rounded-l-xl border border-r-0 border-[var(--color-border-subtle)] text-xs text-muted">
            /events/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="founder-pitch-night"
            className="flex-1 px-3 py-2.5 rounded-r-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.type ?? "Event Type"}
        </label>
        <div className="flex gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                type === opt.value
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-[var(--color-bg)] border-[var(--color-border-subtle)] text-muted hover:border-accent/30"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.location ?? "Location (URL or address)"}
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={type === "ONLINE" ? "https://meet.google.com/..." : "123 Main St, San Francisco, CA"}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Date/Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t.events?.form?.startDate ?? "Start Date"} *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t.events?.form?.startTime ?? "Start Time"} *
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t.events?.form?.endDate ?? "End Date"}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t.events?.form?.endTime ?? "End Time"}
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.coverImage ?? "Cover Image URL"}
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Max Attendees */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.maxAttendees ?? "Max Attendees (optional)"}
        </label>
        <input
          type="number"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          placeholder="Leave blank for unlimited"
          min="1"
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          {t.events?.form?.description ?? "Description"}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder={t.events?.form?.descriptionPlaceholder ?? "What's this event about? Add details, agenda, etc."}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-foreground placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-3 px-6 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {createMutation.isPending
          ? (t.events?.form?.creating ?? "Creating...")
          : (t.events?.form?.createEvent ?? "Create Event")}
      </button>
    </form>
  );
}
