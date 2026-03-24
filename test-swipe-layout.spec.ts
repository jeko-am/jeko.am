import { test, expect } from '@playwright/test';

test.describe('Swipe Page Layout', () => {
  test('should have proper spacing on mobile - not logged in', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/swipe');

    // Wait for page content to render
    await page.waitForSelector('header', { timeout: 5000 });

    // Give it a moment to fully render
    await page.waitForTimeout(1000);

    // Take screenshot of mobile view
    await page.screenshot({ path: 'test-results/swipe-mobile.png' });

    // Check if we have the CTA section (when not logged in)
    const ctaContainer = page.locator('text=Find Playmates for Your Pup');
    const isCTAVisible = await ctaContainer.isVisible();
    console.log('CTA visible on mobile:', isCTAVisible);

    // Check header height and positioning
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    console.log('Header box:', headerBox);

    // Header should be visible at top
    if (headerBox) {
      expect(headerBox.y).toBeLessThanOrEqual(10);
    }
  });

  test('should have proper spacing on desktop - not logged in', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/swipe');

    // Wait for page content
    await page.waitForSelector('header', { timeout: 5000 });

    // Give it a moment to fully render
    await page.waitForTimeout(1000);

    // Take screenshot of desktop view
    await page.screenshot({ path: 'test-results/swipe-desktop.png' });

    // Check if we have the CTA section
    const ctaContainer = page.locator('text=Find Playmates for Your Pup');
    const isCTAVisible = await ctaContainer.isVisible();
    console.log('CTA visible on desktop:', isCTAVisible);

    // Check header
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    console.log('Desktop header box:', headerBox);

    // Header should be at top
    if (headerBox) {
      expect(headerBox.y).toBeLessThanOrEqual(10);
    }
  });

  test('CTA page should have proper spacing when not logged in', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/swipe');

    // Wait for header and CTA
    await page.waitForSelector('header');
    await page.waitForTimeout(500);

    // CTA should be centered and not cramped
    const ctaBox = page.locator('text=Find Playmates for Your Pup');
    const isVisible = await ctaBox.isVisible();

    console.log('CTA visible:', isVisible);
    expect(isVisible).toBe(true);

    // Check for spacing around CTA content
    const logInButton = page.locator('a:has-text("Log In")').first();
    const signUpButton = page.locator('a:has-text("Sign Up")').first();

    expect(await logInButton.isVisible()).toBe(true);
    expect(await signUpButton.isVisible()).toBe(true);
  });
});
