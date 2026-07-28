export default function LearningContentLoading() {
  return (
    <div className="animate-pulse gap-6 p-4 sm:flex sm:p-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Title bar */}
        <div className="h-6 w-56 rounded-md bg-surface-light sm:h-7 sm:w-72" />

        {/* Progress indicator */}
        <div className="h-1.5 w-full rounded-full bg-surface-light" />

        {/* Content area */}
        <div className="space-y-4 rounded-xl bg-surface p-4 sm:p-6">
          <div className="h-5 w-1/2 rounded-md bg-surface-light" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-surface-light" />
            <div className="h-4 w-full rounded-md bg-surface-light" />
            <div className="h-4 w-5/6 rounded-md bg-surface-light" />
            <div className="h-4 w-2/3 rounded-md bg-surface-light" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="mt-6 w-full space-y-3 rounded-xl bg-surface p-4 sm:mt-0 sm:w-64 sm:p-6">
        <div className="h-4 w-24 rounded-md bg-surface-light" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 shrink-0 rounded-full bg-surface-light" />
              <div className="h-4 w-full rounded-md bg-surface-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
