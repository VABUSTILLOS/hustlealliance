import { test, expect } from '@playwright/test';

const PROTECTED_PAGES = ['/admin', '/instructor', '/dashboard'];

for (const path of PROTECTED_PAGES) {
  test(`unauth ${path} redirects to login`, async ({ page }) => {
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    // Should redirect to /login
    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('redirect=');
  });
}

test('signup page has form fields', async ({ page }) => {
  await page.goto('/signup');
  const form = page.locator('form');
  // Should have at least email input
  const emailInput = page.locator('input[type="email"], input[name="email"]');
  await expect(emailInput.first()).toBeVisible();
});

test('login page has form fields', async ({ page }) => {
  await page.goto('/login');
  const emailInput = page.locator('input[type="email"], input[name="email"]');
  await expect(emailInput.first()).toBeVisible();
});

test('favicon is served', async ({ page }) => {
  const res = await page.goto('/favicon.ico');
  expect(res?.status()).toBe(200);
});
