export default function DashboardLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-surface-light rounded-full" />
        <div className="h-8 w-64 bg-surface-light rounded-xl" />
        <div className="h-4 w-96 bg-surface-light rounded-full" />
      </div>

      {/* Content skeleton — 3 cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-surface-light rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-light rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 bg-surface-light rounded-full" />
              <div className="h-3 w-24 bg-surface-light rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-surface-light rounded-full w-full" />
            <div className="h-3 bg-surface-light rounded-full w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
