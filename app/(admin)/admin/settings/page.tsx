'use client';

import { useState, useEffect } from 'react';

type BrandVoice = { tone: string; audience: string; guidelines: string };
type EmailSender = { fromName: string; fromEmail: string };
type ReferralReward = { percentOff: number; maxUses: number };
type SeoDefaults = { titleSuffix: string; description: string; ogImage: string };
type SocialLinks = { twitter: string; instagram: string; youtube: string; tiktok: string; linkedin: string };
type MaintenanceMode = { enabled: boolean; message: string };

const inputClass =
  'w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState('');
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({ tone: '', audience: '', guidelines: '' });
  const [emailSender, setEmailSender] = useState<EmailSender>({ fromName: '', fromEmail: '' });
  const [referralReward, setReferralReward] = useState<ReferralReward>({ percentOff: 20, maxUses: 1 });
  const [seoDefaults, setSeoDefaults] = useState<SeoDefaults>({ titleSuffix: '', description: '', ogImage: '' });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ twitter: '', instagram: '', youtube: '', tiktok: '', linkedin: '' });
  const [analyticsSnippet, setAnalyticsSnippet] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode>({ enabled: false, message: '' });
  const [aiDemoMode, setAiDemoMode] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {};
        if (s.brandVoice) setBrandVoice(s.brandVoice);
        if (s.emailSender) setEmailSender(s.emailSender);
        if (s.referralReward) setReferralReward(s.referralReward);
        if (s.seoDefaults) setSeoDefaults(s.seoDefaults);
        if (s.socialLinks) setSocialLinks({ twitter: '', instagram: '', youtube: '', tiktok: '', linkedin: '', ...s.socialLinks });
        if (s.analyticsSnippet?.snippet) setAnalyticsSnippet(s.analyticsSnippet.snippet);
        if (s.maintenanceMode) setMaintenanceMode(s.maintenanceMode);
        if (typeof s.aiDemoMode === 'boolean') setAiDemoMode(s.aiDemoMode);
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

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">SEO Defaults</h2>
          <p className="text-muted text-xs mt-0.5">Fallbacks for pages without their own SEO settings.</p>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Title suffix (e.g. &quot; | Hustle Alliance&quot;)</label>
          <input
            className={inputClass}
            value={seoDefaults.titleSuffix}
            onChange={(e) => setSeoDefaults({ ...seoDefaults, titleSuffix: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Default meta description</label>
          <textarea
            className={`${inputClass} min-h-[60px]`}
            value={seoDefaults.description}
            onChange={(e) => setSeoDefaults({ ...seoDefaults, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Default OG image URL</label>
          <input
            className={inputClass}
            value={seoDefaults.ogImage}
            onChange={(e) => setSeoDefaults({ ...seoDefaults, ogImage: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <button
          onClick={() => save('seoDefaults', seoDefaults, 'SEO defaults')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save SEO Defaults
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Social Links</h2>
          <p className="text-muted text-xs mt-0.5">Used by social-link blocks and page footers.</p>
        </div>
        {(['twitter', 'instagram', 'youtube', 'tiktok', 'linkedin'] as const).map((network) => (
          <div key={network}>
            <label className="block text-xs text-muted mb-1 capitalize">{network}</label>
            <input
              className={inputClass}
              value={socialLinks[network]}
              onChange={(e) => setSocialLinks({ ...socialLinks, [network]: e.target.value })}
              placeholder={`https://${network}.com/…`}
            />
          </div>
        ))}
        <button
          onClick={() => save('socialLinks', socialLinks, 'Social links')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Social Links
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Analytics Snippet</h2>
          <p className="text-muted text-xs mt-0.5">Injected at the top of every published landing page. Admin-only — treat as trusted code.</p>
        </div>
        <textarea
          className={`${inputClass} min-h-[100px] font-mono text-xs`}
          value={analyticsSnippet}
          onChange={(e) => setAnalyticsSnippet(e.target.value)}
          placeholder="<script>…</script>"
        />
        <button
          onClick={() => save('analyticsSnippet', { snippet: analyticsSnippet }, 'Analytics snippet')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Analytics Snippet
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">AI Demo Mode</h2>
          <p className="text-muted text-xs mt-0.5">
            Force deterministic demo output from AI Studio and member AI even when AI_GATEWAY_API_KEY is
            configured. Takes effect within a minute; no redeploy needed. Useful for demos and screenshots.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={aiDemoMode}
            onChange={(e) => setAiDemoMode(e.target.checked)}
          />
          Force demo AI output
        </label>
        <button
          onClick={() => save('aiDemoMode', aiDemoMode, 'AI demo mode')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save AI Demo Mode
        </button>
      </section>

      <section className="glass-card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Maintenance Mode</h2>
          <p className="text-muted text-xs mt-0.5">Public landing pages show a notice; admins bypass automatically.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={maintenanceMode.enabled}
            onChange={(e) => setMaintenanceMode({ ...maintenanceMode, enabled: e.target.checked })}
          />
          Enable maintenance mode
        </label>
        <div>
          <label className="block text-xs text-muted mb-1">Notice message</label>
          <textarea
            className={`${inputClass} min-h-[60px]`}
            value={maintenanceMode.message}
            onChange={(e) => setMaintenanceMode({ ...maintenanceMode, message: e.target.value })}
            placeholder="We're making improvements — check back soon."
          />
        </div>
        <button
          onClick={() => save('maintenanceMode', maintenanceMode, 'Maintenance mode')}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          Save Maintenance Mode
        </button>
      </section>
    </div>
  );
}
