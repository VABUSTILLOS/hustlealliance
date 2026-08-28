'use client';

import { useState, useEffect } from 'react';

type BrandVoice = { tone: string; audience: string; guidelines: string };
type EmailSender = { fromName: string; fromEmail: string };
type ReferralReward = { percentOff: number; maxUses: number };

const inputClass =
  'w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState('');
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({ tone: '', audience: '', guidelines: '' });
  const [emailSender, setEmailSender] = useState<EmailSender>({ fromName: '', fromEmail: '' });
  const [referralReward, setReferralReward] = useState<ReferralReward>({ percentOff: 20, maxUses: 1 });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {};
        if (s.brandVoice) setBrandVoice(s.brandVoice);
        if (s.emailSender) setEmailSender(s.emailSender);
        if (s.referralReward) setReferralReward(s.referralReward);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async (key: string, value: unknown, label: string) => {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setSaved(label);
      setTimeout(() => setSaved(''), 2000);
    }
  };

  if (loading) return <div className="glass-card p-8 text-center text-muted">Loading settings…</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted text-sm mt-1">Brand voice, email sender identity, and referral rewards.</p>
      </div>

      {saved && (
        <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium">
          {saved} saved ✓
        </div>
      )}

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Brand Voice</h2>
          <p className="text-muted text-xs mt-0.5">Injected into every AI Studio generation.</p>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Tone (e.g. bold, energetic, no-BS)</label>
          <input
            className={inputClass}
            value={brandVoice.tone}
            onChange={(e) => setBrandVoice({ ...brandVoice, tone: e.target.value })}
            placeholder="Confident, direct, motivating"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Audience</label>
          <input
            className={inputClass}
            value={brandVoice.audience}
            onChange={(e) => setBrandVoice({ ...brandVoice, audience: e.target.value })}
            placeholder="Aspiring entrepreneurs and side hustlers"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Guidelines</label>
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={brandVoice.guidelines}
            onChange={(e) => setBrandVoice({ ...brandVoice, guidelines: e.target.value })}
            placeholder="Avoid corporate jargon. Use short sentences. Always include a clear CTA."
          />
        </div>
        <button
          onClick={() => save('brandVoice', brandVoice, 'Brand voice')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Brand Voice
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Email Sender</h2>
          <p className="text-muted text-xs mt-0.5">From name and address used for campaigns and automations.</p>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">From name</label>
          <input
            className={inputClass}
            value={emailSender.fromName}
            onChange={(e) => setEmailSender({ ...emailSender, fromName: e.target.value })}
            placeholder="Hustle Alliance"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">From email</label>
          <input
            className={inputClass}
            value={emailSender.fromEmail}
            onChange={(e) => setEmailSender({ ...emailSender, fromEmail: e.target.value })}
            placeholder="hello@hustlealliance.com"
          />
        </div>
        <button
          onClick={() => save('emailSender', emailSender, 'Email sender')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Email Sender
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Referral Reward</h2>
          <p className="text-muted text-xs mt-0.5">Coupon issued to referrers when their invite converts.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Percent off</label>
            <input
              type="number"
              min={1}
              max={100}
              className={inputClass}
              value={referralReward.percentOff}
              onChange={(e) => setReferralReward({ ...referralReward, percentOff: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Max uses</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={referralReward.maxUses}
              onChange={(e) => setReferralReward({ ...referralReward, maxUses: Number(e.target.value) })}
            />
          </div>
        </div>
        <button
          onClick={() => save('referralReward', referralReward, 'Referral reward')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Referral Reward
        </button>
      </section>
    </div>
  );
}
