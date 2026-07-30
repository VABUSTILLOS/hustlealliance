import { learningPaths } from '@/lib/data/learning-paths';

// Pre-render all learning path preview pages at build time
export function generateStaticParams() {
  return learningPaths.map((path) => ({ slug: path.slug }));
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
