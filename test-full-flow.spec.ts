import { test, expect, Browser, Page } from '@playwright/test';

// Helper to sign up a user end to end
async function signupUser(page: Page, userData: {
  fullName: string;
  email: string;
  password: string;
  city: string;
  dogName: string;
  breed: string;
  dogAge: string;
  gender: string;
  activityLevel: string;
  temperament: string;
  lookingForMate: boolean;
}) {
  console.log(`\n👤 Signing up: ${userData.email}`);

  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('#fullName', { timeout: 10000 });

  // STEP 1: Account
  console.log('  Step 1: Account details');
  await page.fill('#fullName', userData.fullName);
  await page.fill('#email', userData.email);
  await page.fill('#password', userData.password);
  await page.fill('#confirmPassword', userData.password);
  await page.fill('#age', '28');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 2 of 4', { timeout: 8000 });

  // STEP 2: Location
  console.log('  Step 2: Location');
  await page.fill('#city', userData.city);
  const stateInput = page.locator('#state');
  if (await stateInput.isVisible()) await stateInput.fill('England');
  const countrySelect = page.locator('#country, select[name="country"]');
  if (await countrySelect.isVisible()) await countrySelect.selectOption({ label: 'United Kingdom' }).catch(() => {});
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 3 of 4', { timeout: 8000 });

  // STEP 3: Your Dog
  console.log('  Step 3: Dog details');
  await page.fill('#dogName', userData.dogName);
  const breedInput = page.locator('#breed');
  if (await breedInput.isVisible()) await breedInput.fill(userData.breed);
  const dogAgeInput = page.locator('#dogAge');
  if (await dogAgeInput.isVisible()) await dogAgeInput.fill(userData.dogAge);
  // Select gender
  const genderButtons = page.locator(`button:has-text("${userData.gender}")`);
  if (await genderButtons.count() > 0) await genderButtons.first().click();
  await page.click('button:has-text("Next")');
  await page.waitForSelector('text=Step 4 of 4', { timeout: 8000 });

  // STEP 4: Lifestyle
  console.log('  Step 4: Lifestyle');
  // Activity level
  const activityBtn = page.locator(`button:has-text("${userData.activityLevel}")`);
  if (await activityBtn.count() > 0) await activityBtn.first().click();
  // Temperament
  const tempBtn = page.locator(`button:has-text("${userData.temperament}")`);
  if (await tempBtn.count() > 0) await tempBtn.first().click();
  // Looking for mate toggle
  if (userData.lookingForMate) {
    const loveBtn = page.locator('button:has-text("Yes"), label:has-text("Looking for a mate")');
    if (await loveBtn.count() > 0) await loveBtn.first().click();
  }

  // Take screenshot before submit
  await page.screenshot({ path: `test-results/signup-before-submit-${userData.dogName}.png` });

  // Submit
  const submitBtn = page.locator('button[type="submit"]:has-text("Create"), button:has-text("Complete"), button:has-text("Create Account")');
  await submitBtn.first().click();
  console.log('  ✓ Submitted signup form');

  // Wait for redirect
  await page.waitForURL(/community|swipe|dashboard/, { timeout: 15000 });
  console.log(`  ✅ Signup success! Redirected to: ${page.url()}`);

  await page.screenshot({ path: `test-results/signup-success-${userData.dogName}.png` });
}

test('Create User 1 - Bella the Labrador', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await signupUser(page, {
    fullName: 'Sarah Johnson',
    email: `sarah.test.${Date.now()}@example.com`,
    password: 'TestPass123!',
    city: 'London',
    dogName: 'Bella',
    breed: 'Labrador',
    dogAge: '3',
    gender: 'Female',
    activityLevel: 'High',
    temperament: 'Playful',
    lookingForMate: true,
  });

  // After signup, check swipe page
  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/user1-swipe-page.png' });
  console.log('\n✅ User 1 created and on swipe page');
});

test('Create User 2 - Max the Golden Retriever', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await signupUser(page, {
    fullName: 'James Wilson',
    email: `james.test.${Date.now()}@example.com`,
    password: 'TestPass123!',
    city: 'London',
    dogName: 'Max',
    breed: 'Golden Retriever',
    dogAge: '2',
    gender: 'Male',
    activityLevel: 'High',
    temperament: 'Friendly',
    lookingForMate: true,
  });

  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/user2-swipe-page.png' });
  console.log('\n✅ User 2 created and on swipe page');
});

test('Create User 3 - Luna the Poodle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await signupUser(page, {
    fullName: 'Emma Davis',
    email: `emma.test.${Date.now()}@example.com`,
    password: 'TestPass123!',
    city: 'Manchester',
    dogName: 'Luna',
    breed: 'Poodle',
    dogAge: '4',
    gender: 'Female',
    activityLevel: 'Medium',
    temperament: 'Calm',
    lookingForMate: false,
  });

  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/user3-swipe-page.png' });
  console.log('\n✅ User 3 created and on swipe page');
});
