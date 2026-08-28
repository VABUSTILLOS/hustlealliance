'use client';

export type FunnelStep = { label: string; count: number };

type FunnelProps = {
  steps: FunnelStep[];
};

/** Horizontal-bar funnel: % of first step + step-to-step conversion %. */
export default function Funnel({ steps }: FunnelProps) {
  if (steps.length === 0) {
    return <p className="text-sm text-muted">No funnel data yet.</p>;
  }

  const first = steps[0].count || 1;

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const pctOfFirst = Math.round((step.count / first) * 100);
        const prev = i > 0 ? steps[i - 1].count : null;
        const conversion = prev && prev > 0 ? Math.round((step.count / prev) * 100) : null;

        return (
          <div key={step.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{step.label}</span>
              <span className="text-muted">
                {step.count} ({pctOfFirst}%){conversion !== null && ` · ${conversion}% of prev`}
              </span>
            </div>
            <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${pctOfFirst}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
