import { test } from '@playwright/test';

test('Visual test - open browser for manual inspection', async ({ browser }) => {
  // Open a real visible browser window
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();

  console.log('🌐 Opening http://localhost:3000/swipe in visible browser...');
  await page.goto('http://localhost:3000/swipe');

  // Wait for content to load
  await page.waitForSelector('header');
  await page.waitForTimeout(2000);

  console.log('✓ Page loaded. Browser window is open for inspection.');
  console.log('✓ Viewport: 375x667 (mobile)');
  console.log('✓ Taking screenshot...');

  await page.screenshot({ path: 'test-results/visual-mobile-current.png' });

  console.log('✓ Screenshot saved. Keeping browser open for 15 seconds...');
  await page.waitForTimeout(15000);

  console.log('✓ Closing browser');
  await context.close();
});
