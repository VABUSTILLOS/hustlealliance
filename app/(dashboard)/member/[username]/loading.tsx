export default function MemberProfileLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 sm:p-6">
      {/* Avatar + name + bio */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="h-20 w-20 rounded-full bg-surface-light sm:h-24 sm:w-24" />
        <div className="h-5 w-40 rounded-md bg-surface-light sm:w-48" />
        <div className="w-full max-w-md space-y-2">
          <div className="mx-auto h-4 w-5/6 rounded-md bg-surface-light" />
          <div className="mx-auto h-4 w-2/3 rounded-md bg-surface-light" />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-center gap-3">
        <div className="h-8 w-20 rounded-full bg-surface-light sm:w-24" />
        <div className="h-8 w-20 rounded-full bg-surface-light sm:w-24" />
        <div className="h-8 w-20 rounded-full bg-surface-light sm:w-24" />
      </div>

      {/* Tabs bar */}
      <div className="flex gap-4 border-b border-surface-light pb-2">
        <div className="h-5 w-16 rounded-md bg-surface-light" />
        <div className="h-5 w-16 rounded-md bg-surface-light" />
        <div className="h-5 w-16 rounded-md bg-surface-light" />
      </div>

      {/* Content cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl bg-surface p-4 sm:p-6">
            <div className="h-4 w-full rounded-md bg-surface-light" />
            <div className="h-4 w-4/5 rounded-md bg-surface-light" />
          </div>
        ))}
      </div>
    </div>
  );
}
