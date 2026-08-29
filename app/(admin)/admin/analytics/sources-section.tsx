'use client';

import { useEffect, useState } from 'react';

type SourceRow = { source: string; medium: string; orders: number; revenue: number };
type PageRow = { landingPageId: string; title: string; slug: string; orders: number; revenue: number };
type AffiliateRow = { referralId: string; code: string; ownerName: string | null; ownerEmail: string; orders: number; revenue: number };
type SourcesData = { days: number; bySource: SourceRow[]; byPage: PageRow[]; byAffiliate: AffiliateRow[] };

function money(v: number): string {
  return `$${v.toFixed(2)}`;
}

export default function SourcesSection() {
  const [data, setData] = useState<SourcesData | null>(null);
  const [days, setDays] = useState(30);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/analytics/sources?range=${days}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <div className="glass-card p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-heading font-bold">Revenue by source</h3>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                d === days ? 'bg-accent text-white' : 'bg-surface-light text-muted hover:text-foreground'
              }`}
            >
              {d}d
            </button>
          ))}
          <a
            href={`/api/admin/analytics/sources?range=${days}&format=csv`}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-light text-muted hover:text-foreground"
          >
            Export CSV
          </a>
        </div>
      </div>

      {error && <p className="text-muted text-sm">Failed to load source data.</p>}
      {!data && !error && <p className="text-muted text-sm">Loading…</p>}

      {data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h4 className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">UTM</h4>
            {data.bySource.length === 0 ? (
              <p className="text-muted text-sm">No attributed orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data.bySource.slice(0, 8).map((r, i) => (
                    <tr key={i} className="border-b border-surface-light/50 last:border-0">
                      <td className="py-2 text-foreground">{r.source} <span className="text-muted text-xs">/ {r.medium}</span></td>
                      <td className="py-2 text-right text-muted text-xs">{r.orders} orders</td>
                      <td className="py-2 text-right text-foreground font-mono text-xs">{money(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h4 className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Landing pages</h4>
            {data.byPage.length === 0 ? (
              <p className="text-muted text-sm">No page-attributed orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data.byPage.slice(0, 8).map((r) => (
                    <tr key={r.landingPageId} className="border-b border-surface-light/50 last:border-0">
                      <td className="py-2 text-foreground">{r.title}</td>
                      <td className="py-2 text-right text-muted text-xs">{r.orders}</td>
                      <td className="py-2 text-right text-foreground font-mono text-xs">{money(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h4 className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Affiliates</h4>
            {data.byAffiliate.length === 0 ? (
              <p className="text-muted text-sm">No affiliate-attributed orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data.byAffiliate.slice(0, 8).map((r) => (
                    <tr key={r.referralId} className="border-b border-surface-light/50 last:border-0">
                      <td className="py-2 text-foreground">{r.ownerName ?? r.ownerEmail} <span className="text-muted text-xs">({r.code})</span></td>
                      <td className="py-2 text-right text-muted text-xs">{r.orders}</td>
                      <td className="py-2 text-right text-foreground font-mono text-xs">{money(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
