export function PostFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-surface border border-surface-light rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-surface-light" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-surface-light rounded" />
              <div className="h-2 w-32 bg-surface-light rounded" />
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 w-full bg-surface-light rounded" />
            <div className="h-3 w-3/4 bg-surface-light rounded" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-4 w-10 bg-surface-light rounded" />
            <div className="h-4 w-16 bg-surface-light rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
