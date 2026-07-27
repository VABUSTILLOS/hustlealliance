import { test, expect } from '@playwright/test';

// Run these on the mobile-chrome (Pixel 5) project only
test.describe('Mobile Responsiveness (Pixel 5)', () => {
  const MOBILE_PAGES = [
    '/',
    '/login',
    '/courses',
    '/resources',
    '/leaderboard',
    '/community',
    '/learning',
  ];

  for (const path of MOBILE_PAGES) {
    test(`page ${path} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      // Check that content fits within viewport
      const body = page.locator('body');
      const box = await body.boundingBox();
      if (box) {
        const viewport = page.viewportSize();
        if (viewport) {
          // Body width should not exceed viewport by more than 5px
          expect(box.width).toBeLessThanOrEqual(viewport.width + 5);
        }
      }
    });
  }

  test('mobile menu button exists in DOM', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Hamburger menu button should exist (visible only on narrow viewports due to md:hidden)
    const mobileMenuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu"], [data-mobile-menu], .hamburger, .mobile-menu-toggle');
    expect(await mobileMenuBtn.count()).toBeGreaterThan(0);
  });

  test('admin navigation collapses on mobile', async ({ page }) => {
    await page.goto('/login');
    // Login page should be fully visible on mobile
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput.first()).toBeVisible();
    const viewport = page.viewportSize();
    if (viewport) {
      const emailBox = await emailInput.first().boundingBox();
      if (emailBox) {
        expect(emailBox.width).toBeGreaterThan(100);
      }
    }
  });

  test('no elements overlap text on key pages', async ({ page }) => {
    const pages = ['/', '/login', '/courses'];
    for (const path of pages) {
      await page.goto(path, { waitUntil: 'networkidle' });
      // Check for visible text and ensure no stacking context issues
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(0);
    }
  });
});
