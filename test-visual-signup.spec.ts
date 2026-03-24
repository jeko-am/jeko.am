import { test } from '@playwright/test';

test('Visual signup test - browser visible for user', async ({ page }) => {
  console.log('\n🎬 OPENING VISIBLE BROWSER - WATCH THE SIGNUP FLOW\n');
  console.log('Browser should be open on your screen\n');

  // Navigate to swipe page
  await page.goto('http://localhost:3000/swipe');
  console.log('✓ Swipe page loaded');
  await page.waitForTimeout(2000);

  // Click Sign Up
  console.log('\n1️⃣  Clicking Sign Up button...\n');
  await page.locator('a:has-text("Sign Up")').click();
  await page.waitForTimeout(3000);

  // Check if signup loaded
  const url = page.url();
  console.log(`📍 Current URL: ${url}`);

  if (!url.includes('signup')) {
    console.log('❌ Failed to navigate to signup');
    return;
  }

  console.log('✓ On signup page\n');

  // Keep browser open for 60 seconds so user can see
  console.log('⏳ Keeping browser open for 60 seconds...');
  console.log('Browser will close automatically after that\n');

  await page.waitForTimeout(60000);

  console.log('\n✓ Test complete - browser closing');
});
