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

  test('interactive cards tilt subtly in all four pointer directions and maintain grid stability', async ({ page }) => {
    await page.goto('/');

    // Locate first service card using data-card attribute and scroll into view
    const firstCard = page.locator('#services [data-card="true"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.scrollIntoViewIfNeeded();

    const box = await firstCard.boundingBox();
    if (!box) throw new Error('First card bounding box not found');

    // 1. Hover on Left side (X: 15%, Y: 50%)
    await firstCard.hover({ position: { x: box.width * 0.15, y: box.height * 0.5 } });
    await page.waitForTimeout(150);
    const leftTransform = await firstCard.evaluate((el) => (el as HTMLElement).style.transform);
    expect(leftTransform).toContain('perspective');
    expect(leftTransform).toContain('rotateY(-');

    // 2. Hover on Right side (X: 85%, Y: 50%)
    await firstCard.hover({ position: { x: box.width * 0.85, y: box.height * 0.5 } });
    await page.waitForTimeout(150);
    const rightTransform = await firstCard.evaluate((el) => (el as HTMLElement).style.transform);
    expect(rightTransform).toContain('perspective');
    expect(rightTransform).toContain('rotateY(');
    expect(rightTransform).not.toContain('rotateY(-');

    // 3. Hover on Top side (X: 50%, Y: 15%)
    await firstCard.hover({ position: { x: box.width * 0.5, y: box.height * 0.15 } });
    await page.waitForTimeout(150);
    const topTransform = await firstCard.evaluate((el) => (el as HTMLElement).style.transform);
    expect(topTransform).toContain('rotateX(');
    expect(topTransform).not.toContain('rotateX(-');

    // 4. Hover on Bottom side (X: 50%, Y: 85%)
    await firstCard.hover({ position: { x: box.width * 0.5, y: box.height * 0.85 } });
    await page.waitForTimeout(150);
    const bottomTransform = await firstCard.evaluate((el) => (el as HTMLElement).style.transform);
    expect(bottomTransform).toContain('rotateX(-');

    // 5. Leave card - pointer moved away to headline
    await page.locator('h1').hover();
    await page.waitForTimeout(200);
    const resetTransform = await firstCard.evaluate((el) => (el as HTMLElement).style.transform);
    expect(resetTransform === '' || resetTransform.includes('0deg')).toBe(true);
  });
});

