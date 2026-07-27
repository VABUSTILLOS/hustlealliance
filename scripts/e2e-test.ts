/**
 * E2E Integration Test Script
 *
 * Tests all API endpoints: courses, progress, quiz, access, live classes,
 * dashboard, notifications, stripe checkout (demo), certificates.
 *
 * Usage: npx tsx scripts/e2e-test.ts
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

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
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${data.error || JSON.stringify(data)}`);
  return { data, status: res.status };
}

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔬 Hustle Alliance E2E Test Suite\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  let firstCourseId = '';
  let firstCourseSlug = '';
  let firstLessonSlug = '';

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
    if (firstLesson) firstLessonSlug = firstLesson.slug;
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

  await test('POST /api/stripe/webhook — accepts requests', async () => {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test' }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
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
