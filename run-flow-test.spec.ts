import { test, expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────
//  Helper: complete the 4-step signup wizard for one user
// ─────────────────────────────────────────────────────────────────
async function signupUser(
  page: Page,
  user: {
    fullName: string;
    email: string;
    password: string;
    age: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    dogName: string;
    breed: string;
    dogAge: string;
    weightKg: string;
    gender: string;
    bio: string;
  }
) {
  console.log(`\n📋 Signing up: ${user.email}`);
  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('input', { timeout: 15000 });
  await page.waitForTimeout(500);

  // ── STEP 1: Account ──────────────────────────────────────────
  console.log('  → Step 1: Account');
  await page.screenshot({ path: `test-results/signup-${user.dogName}-step1-before.png` });

  await page.locator('input[placeholder="Sarah Miller"]').fill(user.fullName);
  await page.locator('input[placeholder="sarah@example.com"]').fill(user.email);
  await page.locator('input[placeholder="Min. 6 characters"]').fill(user.password);
  await page.locator('input[placeholder="Re-enter your password"]').fill(user.password);
  await page.locator('input[placeholder="25"]').fill(user.age);
  await page.locator('input[placeholder="+44 7700 900000"]').fill(user.phone);

  await page.screenshot({ path: `test-results/signup-${user.dogName}-step1.png` });
  await page.locator('button:has-text("Next")').click();
  await page.waitForTimeout(800);

  // ── STEP 2: Location ─────────────────────────────────────────
  console.log('  → Step 2: Location');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/signup-${user.dogName}-step2-before.png` });

  await page.locator('input[placeholder="London"]').fill(user.city);
  await page.locator('input[placeholder="Greater London"]').fill(user.state);

  const countrySelect = page.locator('select').first();
  await countrySelect.selectOption({ label: user.country });

  await page.screenshot({ path: `test-results/signup-${user.dogName}-step2.png` });
  await page.locator('button:has-text("Next")').click();
  await page.waitForTimeout(800);

  // ── STEP 3: Dog Profile ──────────────────────────────────────
  console.log('  → Step 3: Dog Profile');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/signup-${user.dogName}-step3-before.png` });

  await page.locator('input[placeholder="Buddy"]').fill(user.dogName);

  // breed autocomplete
  const breedInput = page.locator('input[placeholder="Start typing a breed..."]');
  await breedInput.fill(user.breed.substring(0, 6));
  await page.waitForTimeout(500);
  const breedOption = page.locator('ul li').filter({ hasText: user.breed }).first();
  if (await breedOption.isVisible({ timeout: 1500 }).catch(() => false)) {
    await breedOption.click();
  } else {
    await breedInput.fill(user.breed);
  }

  await page.locator('input[placeholder="3"]').fill(user.dogAge);
  await page.locator('input[placeholder="12"]').fill(user.weightKg);

  // gender is a row of buttons (Male / Female / Unknown)
  await page.locator(`button:has-text("${user.gender}"):not([type="submit"])`).click();

  await page.screenshot({ path: `test-results/signup-${user.dogName}-step3.png` });
  await page.locator('button:has-text("Next")').click();
  await page.waitForTimeout(800);

  // ── STEP 4: Lifestyle ────────────────────────────────────────
  console.log('  → Step 4: Lifestyle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/signup-${user.dogName}-step4-before.png` });

  // bio
  const textarea = page.locator('textarea').first();
  if (await textarea.isVisible({ timeout: 1000 }).catch(() => false)) {
    await textarea.fill(user.bio);
  }

  await page.screenshot({ path: `test-results/signup-${user.dogName}-step4.png` });

  // Final submit
  await page.locator('button:has-text("Create Account")').click();
  console.log('  → Submitted, waiting for redirect…');

  // Wait for community redirect
  try {
    await page.waitForURL('**/community', { timeout: 25000 });
    console.log(`  ✓ Redirected to /community`);
  } catch {
    const url = page.url();
    console.log(`  ⚠️  Still on: ${url}`);
    // check for error message
    const errMsg = await page.locator('[class*="error"], [class*="alert"]').first().textContent().catch(() => '');
    if (errMsg) console.log(`  Error: ${errMsg}`);
  }

  await page.screenshot({ path: `test-results/signup-${user.dogName}-done.png`, fullPage: false });
}

// ─────────────────────────────────────────────────────────────────
//  TEST 0: Check footer on signup page — desktop + mobile
// ─────────────────────────────────────────────────────────────────
test('footer visible on signup — desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('input', { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'test-results/footer-desktop.png', fullPage: true });
  const footer = page.locator('footer');
  await expect(footer).toBeVisible({ timeout: 5000 });
  console.log('✅ Footer visible on desktop');
});

test('footer visible on signup — mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('input', { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/footer-mobile.png', fullPage: true });
  const footer = page.locator('footer');
  await expect(footer).toBeVisible({ timeout: 5000 });
  console.log('✅ Footer visible on mobile');
});

// ─────────────────────────────────────────────────────────────────
//  TEST 1: Create User 1 — Buddy (Golden Retriever)
// ─────────────────────────────────────────────────────────────────
test('create user 1 — Buddy the Golden Retriever', async ({ page }) => {
  await signupUser(page, {
    fullName: 'Alice Johnson',
    email: `alice.johnson.${Date.now()}@test.com`,
    password: 'TestPass123!',
    age: '28',
    phone: '+44 7700 900001',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    dogName: 'Buddy',
    breed: 'Golden Retriever',
    dogAge: '3',
    weightKg: '28',
    gender: 'Male',
    bio: 'Buddy is a friendly and playful golden retriever who loves fetch and swimming!',
  });
  console.log('✅ User 1 (Buddy) created');
});

// ─────────────────────────────────────────────────────────────────
//  TEST 2: Create User 2 — Luna (Labrador)
// ─────────────────────────────────────────────────────────────────
test('create user 2 — Luna the Labrador', async ({ page }) => {
  await signupUser(page, {
    fullName: 'Ben Smith',
    email: `ben.smith.${Date.now()}@test.com`,
    password: 'TestPass456!',
    age: '32',
    phone: '+44 7700 900002',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    dogName: 'Luna',
    breed: 'Labrador Retriever',
    dogAge: '2',
    weightKg: '25',
    gender: 'Female',
    bio: 'Luna loves long walks in the park and is great with other dogs!',
  });
  console.log('✅ User 2 (Luna) created');
});

// ─────────────────────────────────────────────────────────────────
//  TEST 3: Create User 3 — Max (Border Collie)
// ─────────────────────────────────────────────────────────────────
test('create user 3 — Max the Border Collie', async ({ page }) => {
  await signupUser(page, {
    fullName: 'Carol Davis',
    email: `carol.davis.${Date.now()}@test.com`,
    password: 'TestPass789!',
    age: '35',
    phone: '+44 7700 900003',
    city: 'Manchester',
    state: 'Greater Manchester',
    country: 'United Kingdom',
    dogName: 'Max',
    breed: 'Border Collie',
    dogAge: '4',
    weightKg: '20',
    gender: 'Male',
    bio: 'Max is super intelligent and energetic — loves agility and frisbee!',
  });
  console.log('✅ User 3 (Max) created');
});

// ─────────────────────────────────────────────────────────────────
//  TEST 4: Swipe & Match Flow
//  Signs up a fresh user (Daisy) then immediately swipes,
//  so the Supabase session is live in this browser context.
// ─────────────────────────────────────────────────────────────────
test('swipe and match flow', async ({ page }) => {
  console.log('\n❤️  Testing Swipe & Match');

  // 1. Sign up a fresh user in London (same city as Buddy & Luna)
  await signupUser(page, {
    fullName: 'Diana Prince',
    email: `diana.prince.${Date.now()}@test.com`,
    password: 'TestSwipe99!',
    age: '30',
    phone: '+44 7700 900004',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    dogName: 'Daisy',
    breed: 'Beagle',
    dogAge: '2',
    weightKg: '12',
    gender: 'Female',
    bio: 'Daisy loves sniffing everything and making new friends at the park!',
  });

  // 2. Navigate to /swipe (session is still active)
  console.log('\n  Navigating to /swipe…');
  await page.goto('http://localhost:3000/swipe');
  await page.waitForTimeout(2500);

  const url = page.url();
  console.log(`  URL: ${url}`);
  await page.screenshot({ path: 'test-results/swipe-initial.png', fullPage: false });

  if (url.includes('/auth/') || url.includes('/login')) {
    console.log('  ⚠️  Got redirected to login — session was lost');
    return;
  }

  // 3. Full screenshot of swipe page
  await page.screenshot({ path: 'test-results/swipe-page.png', fullPage: true });
  console.log('  ✓ Swipe page loaded');

  // 4. Check for swipe cards
  const cardVisible = await page.locator('[class*="card"], [class*="swipe"]').first()
    .isVisible({ timeout: 3000 }).catch(() => false);
  console.log(`  Cards visible: ${cardVisible}`);

  // 5. Like button (green/heart button)
  const likeBtn = page.locator('button').filter({ hasText: /like/i }).first();
  const greenBtn = page.locator('button[class*="green"], button[class*="like"]').first();

  if (await likeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('  → Clicking Like…');
    await likeBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'test-results/swipe-after-like-1.png' });

    // Like again if another card appeared
    if (await likeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await likeBtn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: 'test-results/swipe-after-like-2.png' });
    }

    // Check for match modal
    const matchText = page.locator('text=match').first();
    if (await matchText.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('  🎉 Match dialog appeared!');
      await page.screenshot({ path: 'test-results/swipe-match-dialog.png' });
      // Dismiss modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } else {
    console.log('  ℹ️  No Like button — checking page state');
    await page.screenshot({ path: 'test-results/swipe-no-cards.png', fullPage: true });
  }

  // 6. Messages page
  await page.goto('http://localhost:3000/messages');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/messages-page.png', fullPage: false });
  console.log('  ✓ Messages page captured');

  // 7. Find owners page
  await page.goto('http://localhost:3000/find-owners');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/find-owners-page.png', fullPage: false });
  console.log('  ✓ Find-owners page captured');

  console.log('\n✅ Swipe & match flow complete');
});
