import { test } from '@playwright/test';

test('Test signup flow manually', async ({ page }) => {
  console.log('\n🚀 TESTING SIGNUP FLOW');
  console.log('======================\n');

  // Set viewport to mobile
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to signup
  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('input', { timeout: 10000 });

  console.log('✓ Signup page loaded');

  // Check what step we're on
  const stepIndicators = await page.locator('[data-step]').count();
  console.log(`✓ Found ${stepIndicators} step indicators`);

  // Take initial screenshot
  await page.screenshot({ path: 'test-results/signup-1-initial.png' });

  // Fill in email
  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.fill('testuser@example.com');
  console.log('✓ Filled email');

  // Fill in password
  const passwordInputs = await page.locator('input[type="password"]');
  const count = await passwordInputs.count();
  console.log(`✓ Found ${count} password fields`);

  if (count > 0) {
    await passwordInputs.first().fill('TestPassword123!');
    console.log('✓ Filled password');

    if (count > 1) {
      await passwordInputs.nth(1).fill('TestPassword123!');
      console.log('✓ Filled password confirmation');
    }
  }

  // Look for continue/next button
  const buttons = await page.locator('button').allTextContents();
  console.log('📍 Available buttons:', buttons.filter(b => b.trim().length > 0).slice(0, 5));

  // Try to proceed to next step
  const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next")').first();
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
    console.log('✓ Clicked Continue/Next');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/signup-2-step2.png' });
  }

  console.log('\n⏳ Keeping browser open for 20 seconds...');
  await page.waitForTimeout(20000);

  console.log('✓ Test complete');
});
