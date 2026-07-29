export default function MessagesLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-full border-r lg:w-80 xl:w-96">
        <div className="space-y-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
