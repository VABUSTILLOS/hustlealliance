export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: '#ff6600' }}>Study Group: {slug}</h1>
      <p>Route works. Loading client component...</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__SG_SLUG = "${slug}";`,
        }}
      />
    </div>
  );
}
