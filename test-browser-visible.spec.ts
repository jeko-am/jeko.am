import { test } from '@playwright/test';

test.use({ headless: false });

test('Mobile view - centered layout check', async ({ page }) => {
  console.log('\n🌐 OPENING BROWSER - MOBILE VIEW (375x667)');
  console.log('========================================');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('header');
  await page.waitForTimeout(2000);

  console.log('✓ Page loaded and rendered');
  console.log('✓ Checking if CTA card is centered...\n');

  // Get the white card position
  const card = page.locator('div.bg-white.rounded-2xl');
  const cardBox = await card.boundingBox();

  if (cardBox) {
    const viewportWidth = 375;
    const cardLeft = cardBox.x;
    const cardWidth = cardBox.width;
    const cardCenter = cardLeft + cardWidth / 2;
    const viewportCenter = viewportWidth / 2;
    const offset = Math.abs(cardCenter - viewportCenter);

    console.log('📊 MEASUREMENTS:');
    console.log(`   Card left edge: ${cardLeft}px`);
    console.log(`   Card width: ${cardWidth}px`);
    console.log(`   Card center: ${cardCenter}px`);
    console.log(`   Viewport center: ${viewportCenter}px`);
    console.log(`   Offset from center: ${offset}px`);

    if (offset < 20) {
      console.log('\n✅ CARD IS PROPERLY CENTERED!');
    } else {
      console.log('\n❌ CARD IS NOT CENTERED - offset too large');
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'test-results/visual-browser-mobile.png' });
  console.log('\n📸 Screenshot saved to: test-results/visual-browser-mobile.png');

  console.log('\n⏳ Keeping browser open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  console.log('✓ Test complete');
});

test('Desktop view - centered layout check', async ({ page }) => {
  console.log('\n🖥️  OPENING BROWSER - DESKTOP VIEW (1920x1080)');
  console.log('==============================================');

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/swipe');
  await page.waitForSelector('header');
  await page.waitForTimeout(2000);

  console.log('✓ Page loaded and rendered');

  // Get the white card position
  const card = page.locator('div.bg-white.rounded-2xl');
  const cardBox = await card.boundingBox();

  if (cardBox) {
    const viewportWidth = 1920;
    const cardLeft = cardBox.x;
    const cardWidth = cardBox.width;
    const cardCenter = cardLeft + cardWidth / 2;
    const viewportCenter = viewportWidth / 2;
    const offset = Math.abs(cardCenter - viewportCenter);

    console.log('\n📊 MEASUREMENTS:');
    console.log(`   Card left edge: ${cardLeft}px`);
    console.log(`   Card width: ${cardWidth}px`);
    console.log(`   Card center: ${cardCenter}px`);
    console.log(`   Viewport center: ${viewportCenter}px`);
    console.log(`   Offset from center: ${offset}px`);

    if (offset < 50) {
      console.log('\n✅ CARD IS PROPERLY CENTERED!');
    } else {
      console.log('\n❌ CARD IS NOT CENTERED - offset too large');
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'test-results/visual-browser-desktop.png' });
  console.log('\n📸 Screenshot saved to: test-results/visual-browser-desktop.png');

  console.log('\n⏳ Keeping browser open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  console.log('✓ Test complete');
});
