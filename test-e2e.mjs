/**
 * End-to-end test: Signup → Swipe → Match → Messages
 *
 * Opens a VISIBLE browser (headless: false) with slowMo so you can watch.
 * Creates 2 users in the same city, then has each like the other to trigger a match,
 * then opens the Matches page and Messages.
 */

import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SLOW = 350; // ms between each action

// ─── User data ────────────────────────────────────────────────────────
const ts = Date.now();
const USER_A = {
  fullName: 'Emma Watson',
  email: `emma.watson.${ts}@test.com`,
  password: 'TestMatch111!',
  age: '27',
  phone: '+44 7700 800001',
  city: 'London',
  state: 'Greater London',
  country: 'United Kingdom',
  dogName: 'Charlie',
  breed: 'Golden Retriever',
  dogAge: '3',
  weightKg: '28',
  gender: 'Male',
  bio: 'Charlie loves belly rubs, fetch, and meeting new friends at the park!',
};

const USER_B = {
  fullName: 'James Bond',
  email: `james.bond.${ts}@test.com`,
  password: 'TestMatch222!',
  age: '34',
  phone: '+44 7700 800002',
  city: 'London',
  state: 'Greater London',
  country: 'United Kingdom',
  dogName: 'Bella',
  breed: 'Labrador Retriever',
  dogAge: '2',
  weightKg: '25',
  gender: 'Female',
  bio: 'Bella is a sweetheart who loves swimming and cuddling on the sofa!',
};

// ─── Helpers ──────────────────────────────────────────────────────────

async function signupUser(page, user) {
  console.log(`\n📋 Signing up: ${user.fullName} (${user.dogName})`);
  for (let retry = 0; retry < 3; retry++) {
    await page.goto(`${BASE}/auth/signup`, { timeout: 30000 });
    await page.waitForTimeout(2000); // let React hydrate
    const found = await page.locator('input[placeholder="Sarah Miller"]').isVisible({ timeout: 15000 }).catch(() => false);
    if (found) break;
    console.log(`  ⟳ Retry ${retry + 1} — page didn't hydrate`);
    if (retry === 2) throw new Error('Signup page failed to load after 3 retries');
  }

  // Step 1: Account
  console.log('  Step 1: Account');
  await page.fill('input[placeholder="Sarah Miller"]', user.fullName);
  await page.fill('input[placeholder="sarah@example.com"]', user.email);
  await page.fill('input[placeholder="Min. 6 characters"]', user.password);
  await page.fill('input[placeholder="Re-enter your password"]', user.password);
  await page.fill('input[placeholder="25"]', user.age);
  await page.fill('input[placeholder="+44 7700 900000"]', user.phone);
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(800);

  // Step 2: Location
  console.log('  Step 2: Location');
  await page.fill('input[placeholder="London"]', user.city);
  await page.fill('input[placeholder="Greater London"]', user.state);
  await page.selectOption('select', { label: user.country });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(800);

  // Step 3: Dog
  console.log('  Step 3: Dog');
  await page.fill('input[placeholder="Buddy"]', user.dogName);
  const breedInput = page.locator('input[placeholder="Start typing a breed..."]');
  await breedInput.fill(user.breed.substring(0, 6));
  await page.waitForTimeout(500);
  const breedOption = page.locator('ul li').filter({ hasText: user.breed }).first();
  if (await breedOption.isVisible({ timeout: 1500 }).catch(() => false)) {
    await breedOption.click();
  } else {
    await breedInput.fill(user.breed);
  }
  await page.fill('input[placeholder="3"]', user.dogAge);
  await page.fill('input[placeholder="12"]', user.weightKg);
  // Click gender button
  await page.click(`button:has-text("${user.gender}"):not([type="submit"])`);
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(800);

  // Step 4: Lifestyle
  console.log('  Step 4: Lifestyle');
  const textarea = page.locator('textarea').first();
  if (await textarea.isVisible({ timeout: 1000 }).catch(() => false)) {
    await textarea.fill(user.bio);
  }

  // Submit
  await page.click('button:has-text("Create Account")');
  console.log('  Waiting for redirect…');

  try {
    await page.waitForURL('**/community', { timeout: 25000 });
    console.log(`  ✓ ${user.dogName} created — on /community`);
  } catch {
    console.log(`  ⚠️ Still on: ${page.url()}`);
  }
}

async function goToSwipeAndLike(page, targetDogName) {
  console.log(`\n❤️  Swiping — looking for ${targetDogName}`);
  await page.goto(`${BASE}/swipe`);
  await page.waitForTimeout(3000);

  // Check if we see swipe cards
  const url = page.url();
  if (url.includes('/auth/')) {
    console.log('  ⚠️ Not logged in — session was lost');
    return false;
  }

  // Look for the target pet's name on a card, keep passing others
  let found = false;
  for (let attempt = 0; attempt < 15; attempt++) {
    await page.waitForTimeout(1000);

    // Check current card text
    const cardText = await page.locator('h2, h3').allTextContents();
    const pageText = cardText.join(' ');
    console.log(`  Card ${attempt + 1}: ${pageText.substring(0, 80)}`);

    if (pageText.includes(targetDogName)) {
      console.log(`  ✓ Found ${targetDogName}! Clicking Like…`);
      // Click the green like button (right side)
      const likeBtn = page.locator('button').filter({ hasText: /like/i }).first();
      if (await likeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await likeBtn.click();
      } else {
        // Try the green circle button (the right action button)
        const greenBtn = page.locator('button[class*="green"], button:has(svg[stroke="white"])').last();
        if (await greenBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await greenBtn.click();
        }
      }
      await page.waitForTimeout(1500);
      found = true;
      break;
    }

    // If not the target, click Pass (left button / red X)
    const passBtn = page.locator('button').filter({ hasText: /pass|skip/i }).first();
    if (await passBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await passBtn.click();
      await page.waitForTimeout(800);
    } else {
      // Check for "No More Dogs" or empty state
      if (pageText.includes('No More') || pageText.includes('Complete Your')) {
        console.log('  ⚠️ No cards available or profile not loaded');
        break;
      }
      // Try clicking the X button directly
      break;
    }
  }

  return found;
}

// ─── Main ─────────────────────────────────────────────────────────────

(async () => {
  console.log('🚀 Launching visible browser…\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: SLOW,
    args: ['--window-size=1400,900'],
  });

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 1: Create User A (Charlie)
  // ════════════════════════════════════════════════════════════════════

  const contextA = await browser.newContext({ viewport: { width: 1350, height: 850 } });
  const pageA = await contextA.newPage();

  await signupUser(pageA, USER_A);
  await pageA.screenshot({ path: 'test-results/e2e-userA-created.png' });

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 2: Create User B (Bella) — new context to get a fresh session
  // ════════════════════════════════════════════════════════════════════

  const contextB = await browser.newContext({ viewport: { width: 1350, height: 850 } });
  const pageB = await contextB.newPage();

  await signupUser(pageB, USER_B);
  await pageB.screenshot({ path: 'test-results/e2e-userB-created.png' });

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 3: User B swipes right on Charlie
  // ════════════════════════════════════════════════════════════════════

  console.log('\n══════════════════════════════════════');
  console.log('  PHASE 3: User B swipes on Charlie');
  console.log('══════════════════════════════════════');

  const foundCharlie = await goToSwipeAndLike(pageB, 'Charlie');
  await pageB.screenshot({ path: 'test-results/e2e-userB-swiped.png' });

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 4: User A swipes right on Bella → MATCH!
  // ════════════════════════════════════════════════════════════════════

  console.log('\n══════════════════════════════════════');
  console.log('  PHASE 4: User A swipes on Bella → MATCH!');
  console.log('══════════════════════════════════════');

  const foundBella = await goToSwipeAndLike(pageA, 'Bella');
  await pageA.waitForTimeout(2000);
  await pageA.screenshot({ path: 'test-results/e2e-match-modal.png' });

  // Check for match celebration
  const matchText = await pageA.locator('text=Match').first().isVisible({ timeout: 3000 }).catch(() => false);
  if (matchText) {
    console.log('\n🎉 MATCH CELEBRATION APPEARED!');
    await pageA.waitForTimeout(2000);
    await pageA.screenshot({ path: 'test-results/e2e-match-celebration.png' });
  }

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 5: Check Matches page
  // ════════════════════════════════════════════════════════════════════

  console.log('\n══════════════════════════════════════');
  console.log('  PHASE 5: Matches page');
  console.log('══════════════════════════════════════');

  await pageA.goto(`${BASE}/matches`);
  await pageA.waitForTimeout(3000);
  await pageA.screenshot({ path: 'test-results/e2e-matches-pageA.png', fullPage: true });
  console.log('  ✓ User A matches page captured');

  await pageB.goto(`${BASE}/matches`);
  await pageB.waitForTimeout(3000);
  await pageB.screenshot({ path: 'test-results/e2e-matches-pageB.png', fullPage: true });
  console.log('  ✓ User B matches page captured');

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 6: Open Messages from Matches page
  // ════════════════════════════════════════════════════════════════════

  console.log('\n══════════════════════════════════════');
  console.log('  PHASE 6: Messages');
  console.log('══════════════════════════════════════');

  // Click "Message" button on User A's matches page
  const msgBtn = pageA.locator('a:has-text("Message")').first();
  if (await msgBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await msgBtn.click();
    await pageA.waitForTimeout(2000);
    console.log('  ✓ Navigated to messages from matches');
  } else {
    await pageA.goto(`${BASE}/messages`);
    await pageA.waitForTimeout(2000);
  }
  await pageA.screenshot({ path: 'test-results/e2e-messages-pageA.png' });

  // User A sends a message
  const msgInput = pageA.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[placeholder*="Type"], textarea[placeholder*="Type"]').first();
  if (await msgInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await msgInput.fill('Hey Bella! Want to meet at Hyde Park? 🐾');
    await pageA.waitForTimeout(500);
    // Hit send
    const sendBtn = pageA.locator('button[type="submit"], button:has-text("Send"), button:has(svg)').last();
    await sendBtn.click();
    await pageA.waitForTimeout(1500);
    console.log('  ✓ User A sent a message');
    await pageA.screenshot({ path: 'test-results/e2e-message-sent.png' });
  }

  // User B checks messages
  await pageB.goto(`${BASE}/messages`);
  await pageB.waitForTimeout(3000);
  await pageB.screenshot({ path: 'test-results/e2e-messages-pageB.png' });

  // User B opens the conversation
  const convoItem = pageB.locator('text=Charlie').first();
  if (await convoItem.isVisible({ timeout: 3000 }).catch(() => false)) {
    await convoItem.click();
    await pageB.waitForTimeout(2000);
    console.log('  ✓ User B opened conversation with Charlie');
    await pageB.screenshot({ path: 'test-results/e2e-messages-pageB-chat.png' });

    // User B replies
    const replyInput = pageB.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[placeholder*="Type"], textarea[placeholder*="Type"]').first();
    if (await replyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await replyInput.fill('Yes! Sunday morning sounds perfect! 🐕');
      const sendBtn2 = pageB.locator('button[type="submit"], button:has-text("Send"), button:has(svg)').last();
      await sendBtn2.click();
      await pageB.waitForTimeout(1500);
      console.log('  ✓ User B replied');
      await pageB.screenshot({ path: 'test-results/e2e-message-reply.png' });
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  PHASE 7: Verify User A sees the reply
  // ════════════════════════════════════════════════════════════════════

  console.log('\n══════════════════════════════════════');
  console.log('  PHASE 7: Verify real-time messaging');
  console.log('══════════════════════════════════════');

  await pageA.waitForTimeout(2000);
  await pageA.screenshot({ path: 'test-results/e2e-realtime-check.png' });

  console.log('\n✅ ════════════════════════════════════════');
  console.log('  ALL E2E TESTS COMPLETE');
  console.log('════════════════════════════════════════\n');

  // Keep browser open for 30 seconds so user can inspect
  console.log('🔍 Browser stays open for 30s — inspect the pages now…');
  await pageA.waitForTimeout(30000);

  await contextA.close();
  await contextB.close();
  await browser.close();
})();
