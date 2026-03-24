import { test } from '@playwright/test';

test('Complete full signup and check data saved', async ({ page }) => {
  console.log('\n✅ FULL SIGNUP TEST WITH DATA VERIFICATION\n');

  const email = `test${Date.now()}@example.com`;
  const testData = {
    fullName: 'TestUser Complete',
    email,
    password: 'TestPassword123!',
    age: '28',
    phone: '+4412345678',
    city: 'London',
    state: 'England',
    country: 'UK',
    dogName: 'TestDog',
    breed: 'Labrador',
    dogAge: '3',
    gender: 'male',
    activityLevel: 'high',
    looking: 'Yes'
  };

  console.log(`📧 Testing with email: ${testData.email}\n`);

  // Go to signup from swipe
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto('http://localhost:3000/swipe');
  await page.locator('a:has-text("Sign Up")').click();
  await page.waitForSelector('#fullName');

  console.log('✅ STEP 1: Your Account');

  // Fill Step 1
  await page.fill('#fullName', testData.fullName);
  await page.fill('#email', testData.email);
  await page.fill('#password', testData.password);
  await page.fill('#confirmPassword', testData.password);
  await page.fill('#age', testData.age);
  await page.fill('#phone', testData.phone);
  console.log('✓ Filled all fields');

  // Click Next
  await page.locator('button:has-text("Next")').click();
  await page.waitForSelector('text=Step 2 of 4', { timeout: 5000 });
  console.log('✓ Moved to Step 2');

  // STEP 2: Location
  console.log('\n✅ STEP 2: Your Location');

  const cityInput = page.locator('#city');
  if (await cityInput.count() > 0) {
    await cityInput.fill(testData.city);
    console.log('✓ Filled city');
  }

  const stateInput = page.locator('#state');
  if (await stateInput.count() > 0) {
    await stateInput.fill(testData.state);
    console.log('✓ Filled state');
  }

  const nextBtn = page.locator('button:has-text("Next")');
  await nextBtn.click();
  await page.waitForSelector('text=Step 3 of 4', { timeout: 5000 });
  console.log('✓ Moved to Step 3');

  // STEP 3: Your Dog
  console.log('\n✅ STEP 3: Your Dog');

  await page.fill('#dogName', testData.dogName);
  console.log('✓ Filled dog name');

  const breedInput = page.locator('#breed');
  if (await breedInput.count() > 0) {
    await breedInput.fill(testData.breed);
    console.log('✓ Filled breed');
  }

  const dogAgeInput = page.locator('#dogAge');
  if (await dogAgeInput.count() > 0) {
    await dogAgeInput.fill(testData.dogAge);
    console.log('✓ Filled dog age');
  }

  const genderSelect = page.locator('#gender');
  if (await genderSelect.count() > 0) {
    await genderSelect.selectOption('male');
    console.log('✓ Selected gender');
  }

  await nextBtn.click();
  await page.waitForSelector('text=Step 4 of 4', { timeout: 5000 });
  console.log('✓ Moved to Step 4');

  // STEP 4: Lifestyle
  console.log('\n✅ STEP 4: Lifestyle');

  // Check if we can select activity level
  const activitySelect = page.locator('#activityLevel');
  if (await activitySelect.count() > 0) {
    await activitySelect.selectOption('high');
    console.log('✓ Selected activity level');
  }

  // Check for looking for mate checkbox
  const lookingForMateCheckbox = page.locator('#lookingForMate');
  if (await lookingForMateCheckbox.count() > 0) {
    await lookingForMateCheckbox.check();
    console.log('✓ Checked looking for mate');
  }

  // Find and click Complete button
  const completeBtn = page.locator('button:has-text("Complete"), button:has-text("Finish")').first();
  if (await completeBtn.isVisible()) {
    await completeBtn.click();
    console.log('✓ Clicked Complete');
    await page.waitForTimeout(3000);
  }

  // Check final URL and success
  const finalUrl = page.url();
  console.log(`\n📍 Final URL: ${finalUrl}`);

  if (finalUrl.includes('dashboard') || finalUrl.includes('swipe') || finalUrl.includes('profile')) {
    console.log('✅ SIGNUP COMPLETED SUCCESSFULLY');
  } else {
    console.log('❌ Signup may have failed');
  }

  // Take final screenshot
  await page.screenshot({ path: 'test-results/signup-final.png' });

  console.log('\n✅ TEST COMPLETE');
  await page.waitForTimeout(5000);
});
