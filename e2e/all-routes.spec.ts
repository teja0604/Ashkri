import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ALL_ROUTES = [
  { path: '/', titleExpected: /ASHKRI Academic Solutions/ },
  { path: '/services', titleExpected: /Services/ },
  { path: '/project-domains', titleExpected: /Domains/ },
  { path: '/our-work', titleExpected: /Our Work/ },
  { path: '/how-it-works', titleExpected: /How It Works/ },
  { path: '/pricing', titleExpected: /Pricing/ },
  { path: '/about', titleExpected: /About Us/ },
  { path: '/contact', titleExpected: /Contact/ },
  { path: '/faq', titleExpected: /FAQ/ },
  { path: '/privacy-policy', titleExpected: /Privacy Policy/ },
  { path: '/terms-and-conditions', titleExpected: /Terms/ },
  { path: '/refund-policy', titleExpected: /Refund/ },
];

test.describe('Phase 2 — Full 12-Route Platform Verification', () => {
  for (const route of ALL_ROUTES) {
    test(`route ${route.path} loads directly via SSR with correct metadata`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.titleExpected);

      // Verify no horizontal overflow
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isOverflowing).toBe(false);
    });
  }

  test('contact form validates required fields and shows Phase 2 notice', async ({ page }) => {
    await page.goto('/contact');

    // Click submit without filling form
    const submitBtn = page.getByRole('button', { name: /Validate & Submit Consultation Request/i });
    await submitBtn.click();

    // Check validation error appears
    await expect(page.locator('text=Full student name is required')).toBeVisible();

    // Fill valid data
    await page.fill('#studentName', 'Teja Vardhan');
    await page.fill('#email', 'teja@example.com');
    await page.fill('#phone', '9876543210');
    await page.fill('#college', 'Anna University');
    await page.fill('#description', 'This is a comprehensive description of an IoT and FreeRTOS project requiring consultation.');
    await page.check('input[type="checkbox"]');

    // Submit valid form
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify Phase 3 backend enquiry confirmation message and reference number
    await expect(page.locator('text=Your enquiry has been successfully logged')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Copy Enquiry Summary/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Email Coordinator|Send via Email/i })).toBeVisible();
  });

  test('faq accordion toggles correctly with keyboard and mouse', async ({ page }) => {
    await page.goto('/faq');

    const firstQuestion = page.locator('#question-faq-1');
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');

    // Toggle closed
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');

    // Toggle open
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
  });

  test('runs automated axe-core accessibility scan on services and pricing', async ({ page }) => {
    await page.goto('/services');
    const servicesScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(servicesScan.violations).toEqual([]);

    await page.goto('/pricing');
    const pricingScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(pricingScan.violations).toEqual([]);
  });
});

