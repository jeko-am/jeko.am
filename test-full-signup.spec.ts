import { test } from '@playwright/test';

test('Complete signup flow - check all steps', async ({ page }) => {
  console.log('\n🎯 FULL SIGNUP FLOW TEST\n');

  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto('http://localhost:3000/swipe');

  // Click Sign Up
  await page.locator('a:has-text("Sign Up")').click();
  await page.waitForSelector('input');

  console.log('✓ On signup page');

  // STEP 1: Your Account
  console.log('\n📝 STEP 1: Your Account');

  // Fill Full Name
  await page.fill('input[placeholder*="Full Name"], input[placeholder*="full name"]', 'Test User 123');
  console.log('✓ Filled full name');

  // Fill Email
  await page.fill('input[type="email"]', `test${Date.now()}@example.com`);
  console.log('✓ Filled email');

  // Fill Password
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.first().fill('TestPassword123!');
  console.log('✓ Filled password');

  if (await passwordInputs.nth(1).isVisible()) {
    await passwordInputs.nth(1).fill('TestPassword123!');
    console.log('✓ Filled password confirmation');
  }

  // Fill Age
  const ageInput = page.locator('input[placeholder*="Age"], input[placeholder*="age"]');
  if (await ageInput.isVisible()) {
    await ageInput.fill('30');
    console.log('✓ Filled age');
  }

  // Click Next
  await page.locator('button:has-text("Next")').click();
  await page.waitForTimeout(1000);

  console.log('✓ Clicked Next - moving to step 2');
  let currentUrl = page.url();
  console.log(`  Current URL: ${currentUrl}`);

  // STEP 2: Your Location
  console.log('\n📝 STEP 2: Your Location');

  // Check if we have location fields
  const cityInput = page.locator('input[placeholder*="City"], input[placeholder*="city"]');
  if (await cityInput.isVisible()) {
    await cityInput.fill('London');
    console.log('✓ Filled city');

    // Try to fill state if visible
    const stateInput = page.locator('input[placeholder*="State"], input[placeholder*="state"], input[placeholder*="County"], input[placeholder*="county"]');
    if (await stateInput.isVisible()) {
      await stateInput.fill('England');
      console.log('✓ Filled state/county');
    }

    // Click Next
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
      console.log('✓ Clicked Next - moving to step 3');
    }
  }

  currentUrl = page.url();
  console.log(`  Current URL: ${currentUrl}`);

  // STEP 3: Your Dog
  console.log('\n📝 STEP 3: Your Dog');

  const dogNameInput = page.locator('input[placeholder*="Dog Name"], input[placeholder*="dog name"], input[placeholder*="Pet Name"], input[placeholder*="pet name"]');
  if (await dogNameInput.isVisible()) {
    await dogNameInput.fill('TestDog');
    console.log('✓ Filled dog name');

    // Fill breed
    const breedInput = page.locator('input[placeholder*="Breed"], input[placeholder*="breed"]');
    if (await breedInput.isVisible()) {
      await breedInput.fill('Labrador');
      console.log('✓ Filled breed');
    }

    // Fill dog age
    const ageInput2 = page.locator('input[placeholder*="Age"], input[placeholder*="age"]').nth(1);
    if (await ageInput2.isVisible()) {
      await ageInput2.fill('3');
      console.log('✓ Filled dog age');
    }

    // Click Next
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1500);
      console.log('✓ Clicked Next - moving to step 4');
    }
  }

  currentUrl = page.url();
  console.log(`  Current URL: ${currentUrl}`);

  // Check for success message or redirect
  console.log('\n✅ SIGNUP COMPLETION');
  const successMsg = page.locator('text=Success, text=Complete, text=finished').first();
  const isSuccess = await successMsg.isVisible().catch(() => false);
  console.log(`✓ Success message visible: ${isSuccess}`);

  // Screenshot final state
  await page.screenshot({ path: 'test-results/signup-complete.png' });

  await page.waitForTimeout(5000);
});
