// Server component — enables Next.js Suspense streaming for children.
// Interactive parts (sidebar, mobile nav, gamification widget) are client components.

import { DashboardShell } from './dashboard-shell';
import { ToastContainer } from './toast-container';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastContainer>
      <DashboardShell>{children}</DashboardShell>
    </ToastContainer>
  );
}
