import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';

// ── Debug page: logs everything so we can see what's happening ────

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Read ALL cookies for debugging
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieNames = allCookies.map((c) => c.name);

  // Check for Supabase auth token
  const sbCookie = allCookies.find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  let sessionEmail: string | null = null;
  let sessionError: string | null = null;
  if (sbCookie) {
    try {
      const decoded = JSON.parse(
        Buffer.from(sbCookie.value, 'base64').toString('utf-8')
      );
      sessionEmail = decoded?.user?.email || null;
    } catch (e: any) {
      sessionError = e.message;
    }
  }

  // Check localStorage item (not available server-side, but check cookies)
  const userInfoCookie = allCookies.find((c) => c.name === 'hustle_user_info');

  // Check if course exists
  let courseExists: boolean | null = null;
  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    courseExists = !!course;
  } catch (e: any) {
    courseExists = null;
  }

  // Check if study group exists
  let groupExists: boolean | null = null;
  try {
    const group = await prisma.courseStudyGroup.findFirst({
      where: { course: { slug } },
    });
    groupExists = !!group;
  } catch (e: any) {
    groupExists = null;
  }

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.8, background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff6600', fontSize: 20 }}>Study Group Debug — {slug}</h1>
      <hr style={{ borderColor: '#333', margin: '16px 0' }} />

      <h2>Cookies ({allCookies.length})</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        {JSON.stringify(cookieNames, null, 2)}
      </pre>

      <h2>Supabase Auth Cookie</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        Found: {sbCookie ? 'YES' : 'NO'}
        {sbCookie && `\nName: ${sbCookie.name}\nValue length: ${sbCookie.value.length}`}
      </pre>

      <h2>Session Email</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        Email: {sessionEmail || '(none)'}
        {sessionError && `\nError: ${sessionError}`}
      </pre>

      <h2>Course</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        Exists: {courseExists === null ? 'ERROR' : courseExists ? 'YES' : 'NO'}
      </pre>

      <h2>Study Group</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        Exists: {groupExists === null ? 'ERROR' : groupExists ? 'YES' : 'NO'}
      </pre>

      <h2>User Info Cookie</h2>
      <pre style={{ background: '#1a1a1a', padding: 12, borderRadius: 4 }}>
        Found: {userInfoCookie ? 'YES' : 'NO'}
      </pre>
    </div>
  );
}
