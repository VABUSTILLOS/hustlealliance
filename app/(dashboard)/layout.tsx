// Server component — enables Next.js Suspense streaming for children.
// Interactive parts (sidebar, mobile nav, gamification widget) are client components.

import { ReactQueryProvider as LayoutQueryProvider } from '@/lib/hooks/queryClient';
import { DashboardShell } from './dashboard-shell';
import { ToastContainer } from './toast-container';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutQueryProvider>
      <ToastContainer>
        <DashboardShell>{children}</DashboardShell>
      </ToastContainer>
    </LayoutQueryProvider>
  );
}
