import { StudyGroupClient } from './client';

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StudyGroupClient slug={slug} />;
}
