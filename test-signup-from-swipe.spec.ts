import { test } from '@playwright/test';

test('Test Sign Up button from swipe page', async ({ page }) => {
  console.log('\n🎯 TESTING SIGN UP FROM SWIPE PAGE');
  console.log('===================================\n');

  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to swipe page
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('header');
  await page.waitForTimeout(1500);

  console.log('✓ Swipe page loaded');

  // Take screenshot of swipe page
  await page.screenshot({ path: 'test-results/swipe-before-signup.png' });

  // Find Sign Up button
  const signUpButton = page.locator('a:has-text("Sign Up")').first();
  const isVisible = await signUpButton.isVisible();
  console.log(`✓ Sign Up button visible: ${isVisible}`);

  if (isVisible) {
    const url = await signUpButton.getAttribute('href');
    console.log(`✓ Sign Up button href: ${url}`);

    // Click it
    await signUpButton.click();
    await page.waitForTimeout(2000);

    console.log('✓ Clicked Sign Up button');

    // Check current URL
    const currentUrl = page.url();
    console.log(`✓ Current URL: ${currentUrl}`);

    // Take screenshot
    await page.screenshot({ path: 'test-results/swipe-after-signup-click.png' });

    // Check if we're on signup page
    if (currentUrl.includes('signup')) {
      console.log('✅ Successfully navigated to signup page');

      // Check for form fields
      const fullNameInput = page.locator('input[placeholder*="Full Name"], input[placeholder*="full name"]').first();
      const hasForm = await fullNameInput.isVisible().catch(() => false);
      console.log(`✓ Form visible: ${hasForm}`);
    } else {
      console.log('❌ Did not navigate to signup page');
    }
  } else {
    console.log('❌ Sign Up button not found on swipe page');
  }

  console.log('\n⏳ Keeping browser open for 15 seconds...');
  await page.waitForTimeout(15000);
  console.log('✓ Test complete');
});
