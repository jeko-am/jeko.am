import { test, expect } from '@playwright/test';

test('Test Sign Up link click', async ({ page }) => {
  console.log('\n✅ TESTING SIGN UP LINK NAVIGATION\n');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('a:has-text("Sign Up")');

  // Try direct navigation first to confirm /signup works
  console.log('1️⃣  Testing direct navigation to /signup...');
  await page.goto('http://localhost:3000/signup');
  await page.waitForSelector('h1, h2');
  const pageTitle = await page.title();
  console.log(`✓ Direct nav works, page title: ${pageTitle}`);

  // Go back to swipe
  console.log('\n2️⃣  Going back to swipe page...');
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('a:has-text("Sign Up")');

  // Get the signup link
  const signUpLink = page.locator('a:has-text("Sign Up")').first();
  const href = await signUpLink.getAttribute('href');
  console.log(`✓ Sign Up link href: ${href}`);

  // Click it
  console.log('\n3️⃣  Clicking Sign Up link...');
  await signUpLink.click();

  // Wait to see if it navigates
  await page.waitForTimeout(2000);
  const currentUrl = page.url();
  console.log(`✓ After click - URL: ${currentUrl}`);

  if (currentUrl.includes('/signup')) {
    console.log('✅ SUCCESS - Link navigated to /signup');
  } else {
    console.log('❌ FAILED - Link did not navigate');
    console.log('   This means the <Link> component in CTA is not working');
  }
});
