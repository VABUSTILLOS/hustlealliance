export default function PreviewLoading() {
  return (
    <div className="flex min-h-[50vh] animate-pulse items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-3 rounded-xl bg-surface p-4 sm:p-6">
        <div className="h-5 w-1/2 rounded-md bg-surface-light" />
        <div className="h-4 w-full rounded-md bg-surface-light" />
        <div className="h-4 w-3/4 rounded-md bg-surface-light" />
      </div>
    </div>
  );
}
