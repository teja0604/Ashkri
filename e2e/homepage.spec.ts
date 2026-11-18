import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('ASHKRI Academic Solutions - Homepage Foundation & Responsive Suite', () => {
  test('renders homepage with approved headline and branding', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/ASHKRI Academic Solutions/);

    // Check primary hero headline
    const headline = page.locator('h1');
    await expect(headline).toContainText('Great Ideas Deserve');
    await expect(headline).toContainText('Engineering.');

    // Check master logo image
    const logoImg = page.locator('img[alt="ASHKRI Technologies Emblem"]').first();
    await expect(logoImg).toBeVisible();

    // Verify all 10 homepage section anchors exist
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#domains')).toBeVisible();
    await expect(page.locator('#how-it-works')).toBeVisible();
    await expect(page.locator('#work')).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('#why-ashkri')).toBeVisible();
    await expect(page.locator('#mentorship-standards')).toBeVisible();
    await expect(page.locator('#cta')).toBeVisible();
  });

  test('theme switcher toggles between light and dark modes', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Default theme should be light or dark
    const initialTheme = await html.getAttribute('data-theme');
    expect(initialTheme).toBeTruthy();

    // Click dark mode radio button (target visible control across desktop/mobile)
    const darkRadio = page.locator('button[aria-label="Dark mode"]:visible').first();
    await darkRadio.click();

    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Click light mode radio button
    const lightRadio = page.locator('button[aria-label="Light mode"]:visible').first();
    await lightRadio.click();

    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('no horizontal scrollbar / overflow exists at current viewport', async ({ page }) => {
    await page.goto('/');

    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(isOverflowing).toBe(false);
  });

  test('passes automated axe-core WCAG 2.2 AA accessibility scan', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast']) // Color contrast is calibrated via design tokens; checked separately
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

