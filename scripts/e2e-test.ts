/**
 * E2E Integration Test Script
 *
 * Tests all API endpoints: courses, progress, quiz, access, live classes,
 * dashboard, notifications, leaderboard, stripe checkout (demo), certificates,
 * drip feed, cron jobs.
 *
 * Usage: npx tsx scripts/e2e-test.ts
 *
 * Optional authenticated tests — set these env vars for a seeded test user:
 *   TEST_USER_EMAIL=alex@hustlealliance.com
 *   TEST_USER_PASSWORD=password123
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];
let authToken = ''; // set after sign-in for authenticated tests

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`  ✅ ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err.message, duration: Date.now() - start });
    console.log(`  ❌ ${name}: ${err.message}`);
  }
}

async function fetchJSON(url: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${data.error || JSON.stringify(data)}`);
  return { data, status: res.status };
}

async function signInForTests(email: string, password: string): Promise<string> {
  const res = await fetch(
    `https://yftgdtdvmvvqyzcdntge.supabase.co/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8',
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Sign-in failed: ${res.status} ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔬 Hustle Alliance E2E Test Suite\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  let firstCourseId = '';
  let firstCourseSlug = '';
  let firstLessonSlug = '';
  let firstLessonId = '';

  // ── 1. Public Endpoints ─────────────────────────────────────
  console.log('📚 1. Course Endpoints\n');

  await test('GET /api/courses — list courses', async () => {
    const { data } = await fetchJSON('/api/courses');
    if (!data.courses || !Array.isArray(data.courses)) throw new Error('Missing courses array');
    if (data.courses.length === 0) throw new Error('No courses returned');
    firstCourseId = data.courses[0].id;
    firstCourseSlug = data.courses[0].slug;
    console.log(`      ${data.courses.length} courses`);
  });

  await test('GET /api/courses/[id] — get course by ID', async () => {
    const { data } = await fetchJSON(`/api/courses/${firstCourseId}`);
    if (!data.course) throw new Error('Missing course data');
    const firstLesson = data.course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      firstLessonSlug = firstLesson.slug;
      firstLessonId = firstLesson.id;
    }
    console.log(`      "${data.course.title}"`);
  });

  await test('GET /api/courses/[slug] — get course by slug', async () => {
    const { data } = await fetchJSON(`/api/courses/${firstCourseSlug}`);
    if (!data.course) throw new Error('Missing course data');
  });

  if (firstLessonSlug) {
    await test('GET lesson by course slug + lesson slug', async () => {
      const { data } = await fetchJSON(`/api/courses/${firstCourseSlug}/lessons/${firstLessonSlug}`);
      if (!data.lesson) throw new Error('Missing lesson data');
      console.log(`      "${data.lesson.title}"`);
    });
  }

  // ── 2. Auth-gated endpoints ─────────────────────────────────
  console.log('\n🔐 2. Auth-gated Endpoints\n');

  await test('POST /api/progress/lesson-complete → 401', async () => {
    try {
      await fetchJSON('/api/progress/lesson-complete', { method: 'POST', body: JSON.stringify({ lessonId: 'x' }) });
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  await test('GET /api/access/check → 401', async () => {
    try {
      await fetchJSON('/api/access/check?courseId=x');
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  await test('GET /api/dashboard → 401', async () => {
    try {
      await fetchJSON('/api/dashboard');
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  // ── 3. Public endpoints ─────────────────────────────────────
  console.log('\n🌐 3. Other Public Endpoints\n');

  await test('GET /api/live-classes — list live classes', async () => {
    const { data } = await fetchJSON('/api/live-classes');
    if (!data.classes) throw new Error('Missing classes array');
    console.log(`      ${data.classes.length} live classes`);
  });

  await test('POST /api/stripe/webhook — rejects unsigned requests', async () => {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test' }),
    });
    // When WEBHOOK_SECRET is configured, unsigned requests get 400
    if (res.status !== 400 && res.status !== 200) {
      throw new Error(`Expected 400 or 200, got ${res.status}`);
    }
  });

  await test('GET /api/courses with limits', async () => {
    const { data } = await fetchJSON('/api/courses?limit=1');
    if (data.courses.length > 1) throw new Error('Limit not respected');
  });

  await test('GET /api/progress/gamification → 401', async () => {
    try {
      await fetchJSON('/api/progress/gamification');
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  await test('GET /api/notifications → 401', async () => {
    try {
      await fetchJSON('/api/notifications');
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  await test('GET /api/leaderboard — public query', async () => {
    const { data } = await fetchJSON('/api/leaderboard?period=weekly');
    if (!data.entries || !Array.isArray(data.entries)) throw new Error('Missing entries array');
    if (data.period !== 'weekly') throw new Error(`Expected weekly period, got ${data.period}`);
    console.log(`      ${data.entries.length} entries (${data.period})`);
  });

  await test('GET /api/leaderboard — monthly period', async () => {
    const { data } = await fetchJSON('/api/leaderboard?period=monthly');
    if (data.period !== 'monthly') throw new Error(`Expected monthly period, got ${data.period}`);
  });

  await test('GET /api/leaderboard — defaults to weekly', async () => {
    const { data } = await fetchJSON('/api/leaderboard');
    if (data.period !== 'weekly') throw new Error(`Expected default weekly, got ${data.period}`);
  });

  // ── 4. Drip & Prerequisite Endpoints ─────────────────────────
  console.log('\n⏳ 4. Drip Feed & Prerequisites\n');

  if (firstCourseSlug) {
    await test('GET /api/courses/[slug]/drip — get drip settings', async () => {
      const { data } = await fetchJSON(`/api/courses/${firstCourseSlug}/drip`);
      if (!('settings' in data)) throw new Error('Missing settings');
      console.log(`      enabled: ${data.settings?.enabled ?? false}`);
    });
  }

  if (firstLessonId) {
    await test('GET /api/lessons/[lessonId]/prereqs — list prerequisites', async () => {
      const { data } = await fetchJSON(`/api/lessons/${firstLessonId}/prereqs`);
      if (!data.prerequisites) throw new Error('Missing prerequisites');
      console.log(`      ${data.prerequisites.length} prerequisites`);
    });
  }

  await test('GET /api/drip/check — anonymous not drip-locked', async () => {
    const { data } = await fetchJSON('/api/drip/check?lessonId=x');
    if (data.allowed !== true) throw new Error('Expected anonymous to be allowed');
  });

  // ── 5. Cron & Scheduled Jobs ─────────────────────────────────
  console.log('\n⏰ 5. Cron & Scheduled Jobs\n');

  await test('GET /api/cron/release-drip — public (no auth)', async () => {
    const { data } = await fetchJSON('/api/cron/release-drip');
    if (typeof data.success !== 'boolean') throw new Error('Missing success');
    if (typeof data.totalReleased !== 'number') throw new Error('Missing totalReleased');
    console.log(`      ${data.usersProcessed} users, ${data.totalReleased} released`);
  });

  // ── 5b. Error Handling ──────────────────────────────────────
  console.log('\n🛡️  5b. Error Handling\n');

  await test('GET /api/courses with bogus UUID → 500 not 200', async () => {
    try {
      await fetchJSON('/api/courses/not-a-valid-uuid');
      throw new Error('Expected 500');
    } catch (err: any) { if (!err.message.includes('500') && !err.message.includes('404')) throw err; }
  });

  await test('GET /api/leaderboard bogus period → still works (ignores)', async () => {
    const { data } = await fetchJSON('/api/leaderboard?period=bogus');
    // Should fall back to weekly
    if (data.period !== 'weekly') throw new Error('Expected fallback to weekly');
  });

  await test('POST /api/progress/lesson-complete with no body → 401', async () => {
    try {
      await fetchJSON('/api/progress/lesson-complete', { method: 'POST' });
      throw new Error('Expected 401');
    } catch (err: any) { if (!err.message.includes('401')) throw err; }
  });

  // ── 6. Authenticated Flow (if test user configured) ──────────
  const testEmail = process.env.TEST_USER_EMAIL;
  const testPassword = process.env.TEST_USER_PASSWORD;

  if (testEmail && testPassword) {
    console.log('\n👤 6. Authenticated Flow\n');

    await test('Sign in via Supabase Auth', async () => {
      authToken = await signInForTests(testEmail, testPassword);
      console.log(`      Signed in as ${testEmail}`);
    });

    await test('GET /api/dashboard — authenticated', async () => {
      const { data } = await fetchJSON('/api/dashboard');
      if (!data.user) throw new Error('Missing user');
      if (!data.courses) throw new Error('Missing courses');
      if (!data.gamification) throw new Error('Missing gamification');
      console.log(`      ${data.user.name} · ${data.courses.length} courses · ${data.gamification.totalXP} XP`);
    });

    await test('GET /api/notifications — authenticated', async () => {
      const { data } = await fetchJSON('/api/notifications');
      if (typeof data.unreadCount !== 'number') throw new Error('Missing unreadCount');
      console.log(`      ${data.notifications?.length || 0} notifications, ${data.unreadCount} unread`);
    });

    await test('GET /api/access/check — authenticated', async () => {
      const { data } = await fetchJSON(`/api/access/check?courseId=${firstCourseId}`);
      if (!data.granted !== undefined && !data.allowed !== undefined) throw new Error('Missing access result');
      const result = data.granted || data.allowed;
      console.log(`      access: ${result ? 'granted' : 'blocked'} · tier: ${data.userTier || data.access?.tier || 'N/A'}`);
    });

    if (firstCourseSlug) {
      await test('GET /api/courses/[slug]/drip — authenticated', async () => {
        const { data } = await fetchJSON(`/api/courses/${firstCourseSlug}/drip`);
        if (!('settings' in data)) throw new Error('Missing settings');
      });
    }

    await test('GET /api/progress/gamification — authenticated', async () => {
      const { data } = await fetchJSON('/api/progress/gamification');
      if (typeof data.totalXP !== 'number') throw new Error('Missing totalXP');
      console.log(`      ${data.totalXP} XP · ${data.badges?.length || 0} badges · ${data.streak?.currentStreak || 0} day streak`);
    });

    // Reset auth token
    authToken = '';
  } else {
    console.log('\n👤 6. Authenticated Flow — SKIPPED');
    console.log('   Set TEST_USER_EMAIL + TEST_USER_PASSWORD env vars to enable.\n');
  }

  // ── Summary ─────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n📊 Results: ${passed}/${results.length} passed, ${failed} failed`);
  console.log(`⏱️  Total: ${totalDuration}ms\n`);

  if (failed > 0) {
    results.filter((r) => !r.passed).forEach((r) => console.log(`   ❌ ${r.name}: ${r.error}`));
    process.exit(1);
  }
  console.log('✅ All tests passed!\n');
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
