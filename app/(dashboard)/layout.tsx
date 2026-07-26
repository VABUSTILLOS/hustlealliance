// Server component — enables Next.js Suspense streaming for children.
// Interactive parts (sidebar, mobile nav, gamification widget) are client components.

import { DashboardShell } from './dashboard-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
