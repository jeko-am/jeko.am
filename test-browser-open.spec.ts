import { test } from '@playwright/test';

test('Open browser - KEEP IT OPEN FOR USER', async ({ page }) => {
  console.log('\n\n');
  console.log('🌐 BROWSER WINDOW IS NOW OPEN');
  console.log('================================');
  console.log('\nNavigating to signup from swipe page...\n');

  // Go to swipe
  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(2000);

  // Click Sign Up
  await page.locator('a:has-text("Sign Up")').click();
  await page.waitForTimeout(3000);

  console.log('✓ Signup page should be visible in the browser window');
  console.log('\n⏳ BROWSER WILL STAY OPEN - DO NOT CLOSE');
  console.log('You can now interact with the form manually\n');

  // KEEP BROWSER OPEN - wait 30 minutes (1800000ms)
  await page.waitForTimeout(1800000);
});
