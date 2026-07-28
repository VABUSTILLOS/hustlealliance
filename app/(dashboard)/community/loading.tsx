export default function CommunityLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-40 rounded-md bg-surface-light sm:h-7 sm:w-56" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-surface-light sm:w-20" />
          <div className="h-6 w-20 rounded-full bg-surface-light sm:w-24" />
          <div className="h-6 w-14 rounded-full bg-surface-light sm:w-16" />
          <div className="h-6 w-16 rounded-full bg-surface-light sm:w-20" />
        </div>
      </div>

      {/* Post cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-xl bg-surface p-4 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-surface-light" />
              <div className="h-4 w-32 rounded-md bg-surface-light sm:w-40" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded-md bg-surface-light" />
              <div className="h-4 w-5/6 rounded-md bg-surface-light" />
              <div className="h-4 w-2/3 rounded-md bg-surface-light" />
            </div>
            <div className="h-4 w-20 rounded-md bg-surface-light" />
          </div>
        ))}
      </div>
    </div>
  );
}
