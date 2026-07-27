import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/', title: /Hustle/i },
  { path: '/login', title: /Login|Sign in/i },
  { path: '/signup', title: /Sign|Register|Create/i },
  { path: '/resources', title: /Resource/i },
  { path: '/leaderboard', title: /Leader/i },
  { path: '/community', title: /Community/i },
  { path: '/journey', title: /Journey/i },
  { path: '/spaces', title: /Spaces/i },
  { path: '/planner', title: /Plann/i },
  { path: '/founder-survival', title: /Founder|Survival/i },
  { path: '/learning', title: /Learn/i },
];

for (const { path, title } of PUBLIC_PAGES) {
  test(`page ${path} loads (200)`, async ({ page }) => {
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
  });
}

test('homepage has navigation links', async ({ page }) => {
  await page.goto('/');
  const navLinks = page.locator('nav a, header a');
  expect(await navLinks.count()).toBeGreaterThan(0);
});

test('404 page for non-existent route', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist-12345', { waitUntil: 'domcontentloaded' });
  expect(res?.status()).toBe(404);
});
