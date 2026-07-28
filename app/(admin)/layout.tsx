// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from '@/lib/auth/user';
import { redirect } from 'next/navigation';
import { AdminShell } from './admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // if (!user) redirect('/login');
  // if (user.role !== 'ADMIN') redirect('/dashboard');

  return <AdminShell user={user}>{children}</AdminShell>;
}
