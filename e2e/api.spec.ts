import { test, expect } from '@playwright/test';

const API_ENDPOINTS = [
  { path: '/api/courses', status: 200, desc: 'public courses' },
  { path: '/api/leaderboard', status: 200, desc: 'leaderboard' },
  { path: '/api/live-classes', status: 200, desc: 'live classes' },
  { path: '/api/me', status: 401, desc: 'unauth me' },
  { path: '/api/admin/stats', status: 403, desc: 'unauth admin stats' },
  { path: '/api/admin/courses', status: 403, desc: 'unauth admin courses' },
  { path: '/api/admin/users', status: 403, desc: 'unauth admin users' },
  { path: '/api/instructor/courses', status: 403, desc: 'unauth instructor courses' },
  { path: '/api/instructor/live-classes', status: 403, desc: 'unauth instructor live classes' },
];

for (const { path, status, desc } of API_ENDPOINTS) {
  test(`API ${path} returns ${status}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(status);
  });
}

test('GET /api/courses returns valid JSON array', async ({ request }) => {
  const res = await request.get('/api/courses');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('courses');
  expect(Array.isArray(body.courses)).toBe(true);
});

test('GET /api/leaderboard returns valid JSON', async ({ request }) => {
  const res = await request.get('/api/leaderboard');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('entries');
  expect(Array.isArray(body.entries)).toBe(true);
});
