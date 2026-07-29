export default function EventsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-[var(--color-surface)] rounded w-40 mb-2" />
      <div className="h-4 bg-[var(--color-surface)] rounded w-64 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] h-80">
            <div className="h-40 bg-[var(--color-border-subtle)] rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[var(--color-border-subtle)] rounded w-3/4" />
              <div className="h-3 bg-[var(--color-border-subtle)] rounded w-full" />
              <div className="h-3 bg-[var(--color-border-subtle)] rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
