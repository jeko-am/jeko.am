import { test } from '@playwright/test';

test('Click Sign Up button and wait for navigation', async ({ page }) => {
  console.log('\n🔍 DETAILED SIGN UP BUTTON TEST');
  console.log('================================\n');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('header');

  console.log('✓ Swipe page loaded');

  // Find the Sign Up button
  const signUpLink = page.locator('a:has-text("Sign Up")');
  const count = await signUpLink.count();
  console.log(`✓ Found ${count} Sign Up link(s)`);

  if (count > 0) {
    // Get attributes
    const href = await signUpLink.first().getAttribute('href');
    console.log(`✓ href attribute: ${href}`);

    // Check element is in viewport
    const isInViewport = await signUpLink.first().isInViewport();
    console.log(`✓ Element in viewport: ${isInViewport}`);

    // Check clickable
    const isEnabled = await signUpLink.first().isEnabled();
    console.log(`✓ Element enabled: ${isEnabled}`);

    // Try clicking with Playwright navigation wait
    console.log('📍 Clicking Sign Up button...');

    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => {
      console.log('⚠️  Navigation promise timed out or failed');
      return null;
    });

    await signUpLink.first().click();
    console.log('✓ Click executed');

    const navigation = await navigationPromise;
    console.log(`✓ Navigation completed: ${navigation ? 'YES' : 'NO'}`);

    // Check current URL
    const url = page.url();
    console.log(`📍 Current URL: ${url}`);

    // Try direct link click without waitForNavigation
    if (url.includes('swipe')) {
      console.log('\n❌ Still on swipe page - trying direct click');
      // Maybe the Link component is using client-side routing
      await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
    }

    // Check page content to verify we're on signup
    const signupHeading = page.locator('text=Join the Pack, text=Your Account').first();
    const onSignup = await signupHeading.isVisible().catch(() => false);
    console.log(`✓ On signup page: ${onSignup}`);

    await page.screenshot({ path: 'test-results/signup-detailed-result.png' });
  }

  await page.waitForTimeout(10000);
});
