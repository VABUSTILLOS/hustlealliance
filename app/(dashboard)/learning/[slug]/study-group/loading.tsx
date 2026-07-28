export default function StudyGroupLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-16 bg-surface-light rounded animate-pulse" />
            <div className="h-4 w-4 text-muted">/</div>
            <div className="h-4 w-16 bg-surface-light rounded animate-pulse" />
            <div className="h-4 w-4 text-muted">/</div>
            <div className="h-4 w-24 bg-surface-light rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-surface-light rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-surface-light rounded animate-pulse" />
            </div>
            <div className="h-4 w-28 bg-surface-light rounded animate-pulse" />
          </div>
          {/* Tab skeleton */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 bg-surface-light rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface border border-surface-light rounded-2xl p-5">
            <div className="h-24 bg-surface-light rounded-xl animate-pulse mb-3" />
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-surface-light rounded animate-pulse" />
              <div className="h-10 w-20 bg-surface-light rounded-xl animate-pulse" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-surface-light rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-light animate-pulse" />
                <div>
                  <div className="h-4 w-24 bg-surface-light rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-surface-light rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-full bg-surface-light rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-surface-light rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-surface border border-surface-light rounded-2xl p-5 sticky top-24 space-y-3">
            <div className="h-4 w-24 bg-surface-light rounded animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-light animate-pulse" />
                <div className="h-4 w-20 bg-surface-light rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
