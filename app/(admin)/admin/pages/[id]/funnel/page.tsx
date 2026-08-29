import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
};

type UtmRow = { source: string; medium: string; views: bigint; leads: bigint; sales: bigint };

const RANGE_OPTIONS = [7, 30, 90] as const;

function pct(part: number, whole: number): string {
  if (!whole) return '—';
  return `${((part / whole) * 100).toFixed(1)}%`;
}

export default async function PageFunnelReport({ params, searchParams }: Props) {
  const { id } = await params;
  const { days } = await searchParams;
  const rangeDays = RANGE_OPTIONS.includes(Number(days) as (typeof RANGE_OPTIONS)[number]) ? Number(days) : 30;
  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const page = await prisma.landingPage.findUnique({ where: { id } });
  if (!page) notFound();

  const [counts, utmRows, attributedRevenue] = await Promise.all([
    prisma.pageEvent.groupBy({
      by: ['type'],
      where: { landingPageId: id, createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.$queryRaw<UtmRow[]>`
      SELECT
        COALESCE(utm->>'source', '(direct)') AS source,
        COALESCE(utm->>'medium', '—') AS medium,
        COUNT(*) FILTER (WHERE type = 'VIEW') AS views,
        COUNT(*) FILTER (WHERE type = 'LEAD') AS leads,
        COUNT(*) FILTER (WHERE type = 'SALE') AS sales
      FROM "PageEvent"
      WHERE "landingPageId" = ${id} AND "createdAt" >= ${since}
      GROUP BY 1, 2
      ORDER BY views DESC
      LIMIT 20
    `,
    prisma.storeOrder.aggregate({
      where: { landingPageId: id, status: { in: ['PAID', 'FULFILLED'] }, paidAt: { gte: since } },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
  ]);

  const views = counts.find((c) => c.type === 'VIEW')?._count._all ?? 0;
  const leads = counts.find((c) => c.type === 'LEAD')?._count._all ?? 0;
  const sales = counts.find((c) => c.type === 'SALE')?._count._all ?? 0;
  const maxCount = Math.max(views, leads, sales, 1);

  const stages = [
    { label: 'Views', count: views, color: '#60A5FA' },
    { label: 'Leads', count: leads, color: '#A78BFA' },
    { label: 'Sales', count: sales, color: '#34D399' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <Link href="/admin/pages" className="text-muted text-xs hover:text-foreground">← Pages</Link>
      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Funnel: {page.title}</h1>
          <p className="text-muted text-sm mt-1 font-mono">/p/{page.slug}</p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((d) => (
            <Link
              key={d}
              href={`/admin/pages/${id}/funnel?days=${d}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                d === rangeDays ? 'bg-accent text-white' : 'bg-surface-light text-muted hover:text-foreground'
              }`}
            >
              {d}d
            </Link>
          ))}
        </div>
      </div>

      {/* Funnel stages */}
      <div className="rounded-2xl bg-surface p-6 mb-6">
        <div className="space-y-4">
          {stages.map((s, i) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{s.label}</span>
                <span className="text-muted">
                  {s.count.toLocaleString()}
                  {i > 0 && <span className="ml-2 text-xs">({pct(s.count, stages[i - 1].count)} of prev)</span>}
                </span>
              </div>
              <div className="h-7 rounded-lg bg-surface-light overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all"
                  style={{ width: `${Math.max((s.count / maxCount) * 100, s.count > 0 ? 2 : 0)}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted text-xs mt-4">
          Overall conversion: {pct(sales, views)} of views → sales · Attributed revenue:{' '}
          <span className="text-foreground font-medium">
            ${((attributedRevenue._sum.totalAmount ?? 0) / 1).toFixed(2)}
          </span>{' '}
          ({attributedRevenue._count._all} orders)
        </p>
      </div>

      {/* UTM breakdown */}
      <div className="rounded-2xl bg-surface overflow-hidden">
        <h2 className="px-6 pt-5 pb-3 text-sm font-semibold text-foreground">Traffic by source</h2>
        {utmRows.length === 0 ? (
          <p className="px-6 pb-6 text-muted text-sm">No tracked traffic in this range yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border/50">
                <th className="px-6 py-2 font-medium">Source</th>
                <th className="px-4 py-2 font-medium">Medium</th>
                <th className="px-4 py-2 font-medium text-right">Views</th>
                <th className="px-4 py-2 font-medium text-right">Leads</th>
                <th className="px-6 py-2 font-medium text-right">Sales</th>
              </tr>
            </thead>
            <tbody>
              {utmRows.map((r, i) => (
                <tr key={i} className="border-b border-border/30 last:border-0">
                  <td className="px-6 py-2.5 text-foreground">{r.source}</td>
                  <td className="px-4 py-2.5 text-muted">{r.medium}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{Number(r.views)}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{Number(r.leads)}</td>
                  <td className="px-6 py-2.5 text-right text-foreground">{Number(r.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
