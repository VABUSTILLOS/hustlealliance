'use client';

type StatCardProps = {
  label: string;
  value: string | number;
  delta?: string;
};

/** Small metric card matching the admin dark theme. */
export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="bg-surface-light rounded-xl p-4 border border-surface-light">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
      {delta && <p className="text-xs text-accent mt-1">{delta}</p>}
    </div>
  );
}
