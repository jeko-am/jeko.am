import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SCREENSHOT_DIR = 'test-results';
const TEST_EMAIL = `testdog${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPass123!';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function screenshot(page, name) {
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: true });
  console.log(`  📸 ${name}.png saved`);
}

(async () => {
  console.log('\n🚀 Starting Playwright manual test...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  try {
    // ─── 1. SWIPE PAGE (NOT LOGGED IN) ──────────────────────────────
    console.log('1️⃣  Opening Swipe page (not logged in)...');
    await page.goto(`${BASE}/swipe`, { waitUntil: 'networkidle' });
    await sleep(1000);
    await screenshot(page, '01-swipe-not-logged-in');

    // ─── 2. MATCHES PAGE (NOT LOGGED IN) ────────────────────────────
    console.log('2️⃣  Opening Matches page (not logged in)...');
    await page.goto(`${BASE}/matches`, { waitUntil: 'networkidle' });
    await sleep(1000);
    await screenshot(page, '02-matches-not-logged-in');

    // ─── 3. SIGNUP FLOW ─────────────────────────────────────────────
    console.log('3️⃣  Starting Signup flow...');
    await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
    await sleep(1000);
    await screenshot(page, '03-signup-step1');

    // Step 1: Account
    console.log('   Filling Step 1 (Account)...');
    await page.fill('input[placeholder*="full name" i], input[id="fullName"], input[name="fullName"]', 'Test Dog Owner');
    await sleep(200);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await sleep(200);

    // Find password fields
    const passwordInputs = await page.locator('input[type="password"]').all();
    if (passwordInputs.length >= 2) {
      await passwordInputs[0].fill(TEST_PASSWORD);
      await sleep(200);
      await passwordInputs[1].fill(TEST_PASSWORD);
    } else if (passwordInputs.length === 1) {
      await passwordInputs[0].fill(TEST_PASSWORD);
    }
    await sleep(200);

    // Fill age if present
    const ageInput = page.locator('input[id="age"], input[name="age"], input[placeholder*="age" i]');
    if (await ageInput.count() > 0) {
      await ageInput.first().fill('28');
    }

    await sleep(500);
    await screenshot(page, '04-signup-step1-filled');

    // Click Next
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await sleep(1000);
      await screenshot(page, '05-signup-step2');

      // Step 2: Location
      console.log('   Filling Step 2 (Location)...');
      const cityInput = page.locator('input[id="city"], input[name="city"], input[placeholder*="city" i]');
      if (await cityInput.count() > 0) await cityInput.first().fill('London');

      const stateInput = page.locator('input[id="state"], input[name="state"], input[placeholder*="state" i], input[placeholder*="county" i]');
      if (await stateInput.count() > 0) await stateInput.first().fill('Greater London');

      // Country select/input
      const countrySelect = page.locator('select[id="country"], select[name="country"]');
      if (await countrySelect.count() > 0) {
        await countrySelect.first().selectOption({ label: 'United Kingdom' }).catch(() =>
          countrySelect.first().selectOption('United Kingdom').catch(() => {})
        );
      }

      await sleep(500);
      await screenshot(page, '06-signup-step2-filled');

      // Click Next
      await nextBtn.click();
      await sleep(1000);
      await screenshot(page, '07-signup-step3');

      // Step 3: Dog
      console.log('   Filling Step 3 (Dog)...');
      const dogNameInput = page.locator('input[id="dogName"], input[name="dogName"], input[placeholder*="dog" i]');
      if (await dogNameInput.count() > 0) await dogNameInput.first().fill('Buddy');

      // Breed - autocomplete input
      const breedInput = page.locator('input[id="breed"], input[placeholder*="breed" i]');
      if (await breedInput.count() > 0) {
        await breedInput.first().fill('Golden Retriever');
        await sleep(500);
        // Try to click the autocomplete suggestion
        const suggestion = page.locator('button:has-text("Golden Retriever"), li:has-text("Golden Retriever")');
        if (await suggestion.count() > 0) await suggestion.first().click();
      }

      const dogAgeInput = page.locator('input[id="dogAge"], input[name="dogAge"], input[placeholder*="age" i]');
      if (await dogAgeInput.count() > 0) await dogAgeInput.first().fill('3');

      const weightInput = page.locator('input[id="weightKg"], input[name="weightKg"], input[placeholder*="weight" i]');
      if (await weightInput.count() > 0) await weightInput.first().fill('30');

      // Gender select
      const genderSelect = page.locator('select[id="gender"], select[name="gender"]');
      if (await genderSelect.count() > 0) {
        await genderSelect.first().selectOption('Male').catch(() => {});
      }

      // Pet type select
      const petTypeSelect = page.locator('select[id="petType"], select[name="petType"]');
      if (await petTypeSelect.count() > 0) {
        await petTypeSelect.first().selectOption('Dog').catch(() => {});
      }

      await sleep(500);
      await screenshot(page, '08-signup-step3-filled');

      // Click Next
      await nextBtn.click();
      await sleep(1000);
      await screenshot(page, '09-signup-step4');

      // Step 4: Lifestyle
      console.log('   Filling Step 4 (Lifestyle)...');

      // Activity level select
      const activitySelect = page.locator('select[id="activityLevel"], select[name="activityLevel"]');
      if (await activitySelect.count() > 0) {
        await activitySelect.first().selectOption('high').catch(() =>
          activitySelect.first().selectOption('High').catch(() => {})
        );
      }

      // Temperament select
      const temperamentSelect = page.locator('select[id="temperament"], select[name="temperament"]');
      if (await temperamentSelect.count() > 0) {
        await temperamentSelect.first().selectOption('playful').catch(() =>
          temperamentSelect.first().selectOption('Playful').catch(() => {})
        );
      }

      // Favorite activity
      const favActivitySelect = page.locator('select[id="favoriteActivity"], select[name="favoriteActivity"]');
      if (await favActivitySelect.count() > 0) {
        await favActivitySelect.first().selectOption('fetch').catch(() =>
          favActivitySelect.first().selectOption('Fetch').catch(() => {})
        );
      }

      // Walk preference
      const walkSelect = page.locator('select[id="walkPreference"], select[name="walkPreference"]');
      if (await walkSelect.count() > 0) {
        await walkSelect.first().selectOption({ index: 1 }).catch(() => {});
      }

      // Bio
      const bioInput = page.locator('textarea[id="bio"], textarea[name="bio"], textarea[placeholder*="bio" i]');
      if (await bioInput.count() > 0) {
        await bioInput.first().fill('Buddy loves playing fetch and going on long walks. He is very friendly!');
      }

      await sleep(500);
      await screenshot(page, '10-signup-step4-filled');

      // Submit signup
      const createBtn = page.locator('button:has-text("Create"), button:has-text("Sign Up"), button:has-text("Complete"), button[type="submit"]');
      if (await createBtn.count() > 0) {
        console.log('   Submitting signup...');
        await createBtn.first().click();
        await sleep(3000);
        await screenshot(page, '11-signup-submitted');
      }
    }

    // ─── 4. SWIPE PAGE (LOGGED IN) ──────────────────────────────────
    console.log('4️⃣  Opening Swipe page (logged in)...');
    await page.goto(`${BASE}/swipe`, { waitUntil: 'networkidle' });
    await sleep(2000);
    await screenshot(page, '12-swipe-logged-in');

    // Try swiping - look for pet cards and swipe buttons
    console.log('   Testing swipe interactions...');

    // Look for like/pass buttons
    const likeBtn = page.locator('button:has-text("Like"), button[aria-label*="like" i], button:has-text("❤"), button:has-text("♥")');
    const passBtn = page.locator('button:has-text("Pass"), button[aria-label*="pass" i], button:has-text("✕"), button:has-text("✗"), button:has-text("×")');

    // Swipe on a few cards
    for (let i = 0; i < 3; i++) {
      await sleep(1000);

      if (await likeBtn.count() > 0) {
        console.log(`   Swiping LIKE on card ${i + 1}...`);
        await likeBtn.first().click();
        await sleep(1500);
        await screenshot(page, `13-swipe-like-${i + 1}`);
      } else if (await passBtn.count() > 0) {
        console.log(`   Swiping PASS on card ${i + 1}...`);
        await passBtn.first().click();
        await sleep(1500);
        await screenshot(page, `13-swipe-pass-${i + 1}`);
      } else {
        console.log('   No swipe buttons found, trying touch swipe...');
        // Try touch swipe
        const card = page.locator('[class*="card"], [class*="swipe"], [data-testid*="card"]');
        if (await card.count() > 0) {
          const box = await card.first().boundingBox();
          if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width + 100, box.y + box.height / 2, { steps: 10 });
            await page.mouse.up();
            await sleep(1000);
          }
        }
        await screenshot(page, `13-swipe-attempt-${i + 1}`);
        break;
      }
    }

    // ─── 5. MATCHES PAGE (LOGGED IN) ────────────────────────────────
    console.log('5️⃣  Opening Matches page (logged in)...');
    await page.goto(`${BASE}/matches`, { waitUntil: 'networkidle' });
    await sleep(2000);
    await screenshot(page, '14-matches-logged-in');

    // Check for match cards or empty state
    const matchCards = page.locator('[class*="match"], [class*="card"]');
    const matchCount = await matchCards.count();
    console.log(`   Found ${matchCount} match card elements`);

    // Check bottom nav bar navigation
    console.log('6️⃣  Testing bottom nav bar...');
    const bottomNav = page.locator('nav a, [class*="nav"] a, [class*="bottom"] a');
    const navCount = await bottomNav.count();
    console.log(`   Found ${navCount} nav links`);

    await screenshot(page, '15-final-state');

    console.log('\n✅ All tests completed! Screenshots saved to test-results/\n');
    console.log('Test email used:', TEST_EMAIL);

    // Keep browser open for 30 seconds for manual inspection
    console.log('Browser staying open for 30s for manual inspection...');
    await sleep(30000);

  } catch (err) {
    console.error('❌ Test error:', err.message);
    await screenshot(page, 'error-state').catch(() => {});
  } finally {
    await browser.close();
  }
})();
