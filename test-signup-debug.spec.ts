import { test } from '@playwright/test';

test('Debug signup - capture all console errors', async ({ page }) => {
  const consoleLogs: string[] = [];
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  // Capture all console output
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') consoleErrors.push(text);
  });

  // Capture network failures
  page.on('requestfailed', req => {
    networkErrors.push(`FAILED: ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  // Capture responses with errors
  page.on('response', async res => {
    if (res.url().includes('supabase') && res.status() >= 400) {
      const body = await res.text().catch(() => '');
      consoleLogs.push(`SUPABASE ERROR ${res.status()}: ${res.url()} - ${body}`);
    }
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('#fullName', { timeout: 10000 });

  const email = `debug.test.${Date.now()}@example.com`;
  console.log(`\n📧 Test email: ${email}\n`);

  // STEP 1
  await page.fill('#fullName', 'Debug User');
  await page.fill('#email', email);
  await page.fill('#password', 'TestPass123!');
  await page.fill('#confirmPassword', 'TestPass123!');
  await page.fill('#age', '28');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 2 of 4', { timeout: 8000 });
  console.log('✓ Step 1 done');

  // STEP 2
  await page.fill('#city', 'London');
  const stateInput = page.locator('#state');
  if (await stateInput.isVisible()) await stateInput.fill('England');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 3 of 4', { timeout: 8000 });
  console.log('✓ Step 2 done');

  // STEP 3
  await page.fill('#dogName', 'DebugDog');
  const breedInput = page.locator('#breed');
  if (await breedInput.isVisible()) await breedInput.fill('Poodle');
  const dogAgeInput = page.locator('#dogAge');
  if (await dogAgeInput.isVisible()) await dogAgeInput.fill('2');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 4 of 4', { timeout: 8000 });
  console.log('✓ Step 3 done');

  // STEP 4 - take screenshot to see what fields are visible
  await page.screenshot({ path: 'test-results/debug-step4.png' });

  // Get all visible inputs and selects on step 4
  const labels = await page.locator('label').allTextContents();
  console.log('\n📋 Step 4 labels:', labels.filter(l => l.trim()).join(', '));

  const selects = await page.locator('select').count();
  const buttons = await page.locator('button').allTextContents();
  console.log('📋 Step 4 selects:', selects);
  console.log('📋 Step 4 buttons:', buttons.filter(b => b.trim() && b !== '>' && b !== '<').join(', '));

  // SUBMIT
  console.log('\n🚀 Submitting form...');
  await page.locator('button:has-text("Create Account")').click();

  // Wait for redirect or error
  await page.waitForTimeout(8000);

  const finalUrl = page.url();
  console.log(`\n📍 Final URL: ${finalUrl}`);

  // Check if on community/swipe
  if (finalUrl.includes('community') || finalUrl.includes('swipe')) {
    console.log('✅ Signup redirect succeeded');
  }

  // Print ALL console output
  console.log('\n📝 ALL CONSOLE LOGS:');
  consoleLogs.forEach(log => console.log('  ', log));

  if (consoleErrors.length > 0) {
    console.log('\n❌ CONSOLE ERRORS:');
    consoleErrors.forEach(err => console.log('  ', err));
  }

  if (networkErrors.length > 0) {
    console.log('\n❌ NETWORK ERRORS:');
    networkErrors.forEach(err => console.log('  ', err));
  }

  // Go to swipe page and check profile
  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/debug-swipe-after.png' });

  const hasProfile = await page.locator('text=Complete Your Pet Profile').isVisible();
  const swipeWorking = await page.locator('text=Find Playmates').isVisible().catch(() => false);
  const statsBar = await page.locator('text=Likes Today, text=Matches').first().isVisible().catch(() => false);

  console.log(`\n✅ Pet profile missing: ${hasProfile}`);
  console.log(`✅ Swipe CTA visible: ${swipeWorking}`);
  console.log(`✅ Stats bar visible: ${statsBar}`);
});
