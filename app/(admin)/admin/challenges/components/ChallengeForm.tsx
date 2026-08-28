"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type TaskRow = {
  id?: string;
  dayNumber: number;
  title: string;
  description: string;
  sortOrder: number;
};

export type ChallengeFormValues = {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  maxParticipants: string;
  status: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toDatetimeLocal(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ChallengeForm({
  challengeId,
  initialValues,
  initialTasks,
}: {
  challengeId?: string;
  initialValues?: Partial<ChallengeFormValues>;
  initialTasks?: TaskRow[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ChallengeFormValues>({
    title: initialValues?.title ?? "",
    slug: initialValues?.slug ?? "",
    description: initialValues?.description ?? "",
    coverImage: initialValues?.coverImage ?? "",
    startDate: toDatetimeLocal(initialValues?.startDate ?? ""),
    endDate: toDatetimeLocal(initialValues?.endDate ?? ""),
    price: initialValues?.price ?? 0,
    currency: initialValues?.currency ?? "USD",
    maxParticipants: initialValues?.maxParticipants ?? "",
    status: initialValues?.status ?? "DRAFT",
  });
  const [slugTouched, setSlugTouched] = useState(!!initialValues?.slug);
  const [tasks, setTasks] = useState<TaskRow[]>(
    initialTasks?.length ? initialTasks : [{ dayNumber: 1, title: "", description: "", sortOrder: 0 }],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof ChallengeFormValues>(key: K, value: ChallengeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key === "title" && !slugTouched) {
      setValues((v) => ({ ...v, slug: slugify(String(value)) }));
    }
  }

  function updateTask(index: number, patch: Partial<TaskRow>) {
    setTasks((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addTask() {
    setTasks((rows) => [
      ...rows,
      { dayNumber: rows.length + 1, title: "", description: "", sortOrder: rows.length },
    ]);
  }

  function removeTask(index: number) {
    setTasks((rows) => rows.filter((_, i) => i !== index));
  }

  function moveTask(index: number, direction: -1 | 1) {
    setTasks((rows) => {
      const next = [...rows];
      const target = index + direction;
      if (target < 0 || target >= next.length) return rows;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((r, i) => ({ ...r, sortOrder: i }));
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        coverImage: values.coverImage || null,
        status: values.status,
        startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
        price: Number(values.price) || 0,
        currency: values.currency,
        maxParticipants: values.maxParticipants ? Number(values.maxParticipants) : null,
      };

      let id = challengeId;
      if (id) {
        const res = await fetch(`/api/admin/challenges/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save challenge");
      } else {
        const res = await fetch("/api/admin/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to create challenge");
        id = data.challenge.id;
      }

      const validTasks = tasks.filter((t) => t.title.trim());
      await fetch(`/api/admin/challenges/${id}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: validTasks.map((t, i) => ({
            dayNumber: t.dayNumber,
            title: t.title,
            description: t.description || null,
            sortOrder: t.sortOrder ?? i,
          })),
        }),
      });

      router.push(`/admin/challenges/${id}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Title</label>
            <input
              type="text"
              value={values.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Slug</label>
            <input
              type="text"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField("slug", slugify(e.target.value));
              }}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">Description</label>
          <textarea
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">Cover image URL</label>
          <input
            type="text"
            value={values.coverImage}
            onChange={(e) => updateField("coverImage", e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Start date</label>
            <input
              type="datetime-local"
              value={values.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">End date</label>
            <input
              type="datetime-local"
              value={values.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Price (0 = free)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Max participants</label>
            <input
              type="number"
              min={0}
              value={values.maxParticipants}
              onChange={(e) => updateField("maxParticipants", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Unlimited"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Status</label>
            <select
              value={values.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-surface-light text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="DRAFT">Draft</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="ENDED">Ended</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-surface-light rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Daily tasks</h2>
          <button
            onClick={addTask}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-light text-foreground hover:bg-accent/20 transition"
          >
            + Add task
          </button>
        </div>
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[var(--color-bg)] border border-surface-light">
              <input
                type="number"
                min={1}
                value={task.dayNumber}
                onChange={(e) => updateTask(i, { dayNumber: Number(e.target.value) })}
                className="w-16 px-2 py-1.5 rounded-lg bg-surface border border-surface-light text-xs text-foreground"
                title="Day #"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(i, { title: e.target.value })}
                  placeholder="Task title"
                  className="w-full px-2 py-1.5 rounded-lg bg-surface border border-surface-light text-xs text-foreground"
                />
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) => updateTask(i, { description: e.target.value })}
                  placeholder="Description (optional)"
                  className="w-full px-2 py-1.5 rounded-lg bg-surface border border-surface-light text-xs text-foreground"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => moveTask(i, -1)} className="text-muted hover:text-foreground text-xs px-1">
                  ↑
                </button>
                <button onClick={() => moveTask(i, 1)} className="text-muted hover:text-foreground text-xs px-1">
                  ↓
                </button>
                <button onClick={() => removeTask(i)} className="text-red-400 hover:text-red-300 text-xs px-1">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !values.title || !values.slug}
        className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save challenge"}
      </button>
    </div>
  );
}
