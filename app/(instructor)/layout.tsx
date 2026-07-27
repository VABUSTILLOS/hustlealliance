import { getCurrentUser } from '@/lib/auth/user';
import { redirect } from 'next/navigation';
import { InstructorShell } from './instructor-shell';

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') redirect('/dashboard');

  return <InstructorShell user={user}>{children}</InstructorShell>;
}
