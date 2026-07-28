// Minimal test: no imports needed

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Minimal test: confirm the page module loads and renders
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-foreground">Study Group — Page Loaded</h1>
      <p className="text-muted mt-2">Slug: {slug}</p>
    </div>
  );
}
