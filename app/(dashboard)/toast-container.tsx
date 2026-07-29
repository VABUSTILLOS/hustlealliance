'use client';

import { ToastProvider } from '@/app/(dashboard)/components/Toast';
import { useNotificationStream } from '@/lib/realtime/hooks/useNotificationStream';

function NotificationStreamListener() {
  useNotificationStream();
  return null;
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <NotificationStreamListener />
      {children}
    </ToastProvider>
  );
}
