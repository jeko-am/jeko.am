import { test, expect } from '@playwright/test';

test('Mobile menu dropdown should expand without navigating', async ({ page }) => {
  // Go to home page
  await page.goto('http://localhost:3000');

  // Wait for header to load
  await page.waitForSelector('header');

  // Get viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });

  // Click hamburger menu
  const hamburger = page.locator('button[aria-label="Open menu"]');
  await hamburger.click();

  // Wait for mobile menu to appear
  await page.waitForSelector('nav');

  // Get the Community menu item
  const communityLink = page.locator('a:has-text("Community")').first();
  const initialUrl = page.url();

  // Click Community item
  await communityLink.click();

  // Check if it navigated (BUG) or stayed on page (expected)
  const finalUrl = page.url();

  console.log('Initial URL:', initialUrl);
  console.log('Final URL:', finalUrl);
  console.log('Did it navigate?', initialUrl !== finalUrl);

  // Should NOT have navigated to /community
  expect(finalUrl).toBe(initialUrl);
});
