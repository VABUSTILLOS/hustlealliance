'use client';

import { useEffect, useState } from 'react';

type Automation = {
  id: string;
  name: string;
  trigger: Trigger;
  subject: string;
  html: string;
  delayMinutes: number;
  isActive: boolean;
  _count: { runs: number };
};

type Trigger =
  | 'SIGNUP'
  | 'ENROLLMENT'
  | 'PURCHASE'
  | 'DRIP'
  | 'TAG_ADDED'
  | 'LEAD_CAPTURED'
  | 'ABANDONED_CART';

const TRIGGER_OPTIONS: { value: Trigger; label: string }[] = [
  { value: 'SIGNUP', label: 'Signup' },
  { value: 'ENROLLMENT', label: 'Enrollment' },
  { value: 'PURCHASE', label: 'Purchase' },
  { value: 'DRIP', label: 'Drip' },
  { value: 'TAG_ADDED', label: 'Tag added' },
  { value: 'LEAD_CAPTURED', label: 'Lead captured' },
  { value: 'ABANDONED_CART', label: 'Abandoned cart' },
];
const empty: { name: string; trigger: Trigger; subject: string; html: string; delayMinutes: number; isActive: boolean } = {
  name: '',
  trigger: 'SIGNUP',
  subject: '',
  html: '',
  delayMinutes: 0,
  isActive: true,
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/email/automations')
      .then((r) => r.json())
      .then((data) => setAutomations(data.automations || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    const url = editingId ? `/api/admin/email/automations/${editingId}` : '/api/admin/email/automations';
    await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(empty);
    setEditingId(null);
    load();
  };

  const edit = (a: Automation) => {
    setEditingId(a.id);
    setForm({
      name: a.name,
      trigger: a.trigger,
      subject: a.subject,
      html: a.html,
      delayMinutes: a.delayMinutes,
      isActive: a.isActive,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this automation?')) return;
    await fetch(`/api/admin/email/automations/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (a: Automation) => {
    await fetch(`/api/admin/email/automations/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !a.isActive }),
    });
    load();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Email Automations</h1>
      <p className="text-muted text-sm mb-8">Trigger-based drip emails. Evaluated every 15 minutes.</p>

      <div className="bg-surface border border-surface-light rounded-2xl p-4 mb-8 space-y-4">
        <h3 className="text-sm font-medium text-foreground">{editingId ? 'Edit automation' : 'New automation'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-foreground text-sm"
          />
          <select
            value={form.trigger}
            onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value as Automation['trigger'] }))}
            className="px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-foreground text-sm"
          >
            {TRIGGER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className="w-full px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-foreground text-sm"
        />
        <textarea
          placeholder="HTML body"
          rows={6}
          value={form.html}
          onChange={(e) => setForm((f) => ({ ...f, html: e.target.value }))}
          className="w-full px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-foreground text-sm font-mono"
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          Delay (minutes)
          <input
            type="number"
            min={0}
            value={form.delayMinutes}
            onChange={(e) => setForm((f) => ({ ...f, delayMinutes: Number(e.target.value) }))}
            className="w-24 px-2 py-1 bg-surface-light border border-surface-light rounded-lg text-foreground text-xs"
          />
        </label>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={!form.name || !form.subject || !form.html}
            className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="px-4 py-2 bg-surface-light rounded-xl text-sm text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {automations.map((a) => (
            <div key={a.id} className="bg-surface border border-surface-light rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-foreground font-medium">{a.name}</p>
                <p className="text-muted text-xs">
                  {a.trigger} · delay {a.delayMinutes}m · {a._count.runs} runs
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => toggleActive(a)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${a.isActive ? 'bg-green-500/20 text-green-400' : 'bg-surface-light text-muted'}`}
                >
                  {a.isActive ? 'Active' : 'Paused'}
                </button>
                <button onClick={() => edit(a)} className="text-xs text-accent hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(a.id)} className="text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
