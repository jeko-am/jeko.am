import { test, expect } from '@playwright/test';

test.describe('Swipe Page Manual Layout Verification', () => {
  test('Mobile: Check spacing and interact with CTA', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/swipe');
    await page.waitForSelector('header');
    await page.waitForTimeout(1500);

    // Screenshot 1: Initial view
    console.log('📱 Mobile - Initial view');
    await page.screenshot({ path: 'test-results/manual-mobile-1-initial.png' });

    // Check header is fixed and visible
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    console.log('✓ Header position:', { x: headerBox?.x, y: headerBox?.y, height: headerBox?.height });

    // Check main content is below header and not overlapped
    const ctaSection = page.locator('text=Find Playmates for Your Pup').first();
    const ctaBox = await ctaSection.boundingBox();
    console.log('✓ CTA section position:', { y: ctaBox?.y });

    // CTA should be well below the header
    expect(ctaBox!.y).toBeGreaterThan(80);
    console.log('✓ Good spacing: CTA is', ctaBox!.y - (headerBox!.height || 64), 'px below header');

    // Scroll down and check spacing
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);
    console.log('📱 Mobile - After scroll');
    await page.screenshot({ path: 'test-results/manual-mobile-2-scrolled.png' });

    // Hover/click on Log In button to check it's accessible
    const logInButton = page.locator('a:has-text("Log In")').first();
    const logInBox = await logInButton.boundingBox();
    console.log('✓ Log In button position:', logInBox);

    // Check spacing between buttons
    const signUpButton = page.locator('a:has-text("Sign Up")').first();
    const signUpBox = await signUpButton.boundingBox();

    if (logInBox && signUpBox) {
      const verticalGap = signUpBox.y - (logInBox.y + logInBox.height);
      console.log('✓ Spacing between buttons:', verticalGap, 'px');
      expect(verticalGap).toBeGreaterThan(10);
    }

    // Scroll back to top
    await page.goto('http://localhost:3000/swipe');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/manual-mobile-3-final.png' });
    console.log('✓ Mobile test complete');
  });

  test('Desktop: Check spacing and layout balance', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/swipe');
    await page.waitForSelector('header');
    await page.waitForTimeout(1500);

    // Screenshot 1: Initial desktop view
    console.log('🖥️  Desktop - Initial view');
    await page.screenshot({ path: 'test-results/manual-desktop-1-initial.png' });

    // Check header dimensions
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    console.log('✓ Header dimensions:', { width: headerBox?.width, height: headerBox?.height });

    // Check CTA card is centered - look for the white card
    const ctaHeading = page.locator('h2:has-text("Find Playmates for Your Pup")');
    const ctaHeadingBox = await ctaHeading.boundingBox();
    console.log('✓ CTA heading position:', ctaHeadingBox);

    if (ctaHeadingBox) {
      // Check if heading is roughly centered horizontally
      const pageWidth = 1920;
      const headingCenter = ctaHeadingBox.x + ctaHeadingBox.width / 2;
      const pageCenter = pageWidth / 2;
      const offset = Math.abs(headingCenter - pageCenter);
      console.log('✓ CTA heading centering offset:', offset, 'px (should be small)');
      expect(offset).toBeLessThan(100);

      // Check vertical spacing below header
      const spaceBelowHeader = ctaHeadingBox.y - (headerBox?.height || 80);
      console.log('✓ Space below header to CTA:', spaceBelowHeader, 'px');
      expect(spaceBelowHeader).toBeGreaterThan(40);
    }

    // Check if footer is visible
    const footer = page.locator('footer');
    const footerVisible = await footer.isVisible();
    console.log('✓ Footer visible:', footerVisible);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    console.log('🖥️  Desktop - After scroll');
    await page.screenshot({ path: 'test-results/manual-desktop-2-scrolled.png' });

    // Check buttons spacing on desktop
    const logInButton = page.locator('a:has-text("Log In")').first();
    const signUpButton = page.locator('a:has-text("Sign Up")').first();

    const logInBox = await logInButton.boundingBox();
    const signUpBox = await signUpButton.boundingBox();

    if (logInBox && signUpBox) {
      const horizontalGap = signUpBox.x - (logInBox.x + logInBox.width);
      console.log('✓ Horizontal gap between buttons:', horizontalGap, 'px');
      expect(horizontalGap).toBeGreaterThan(15);
    }

    // Scroll back to top
    await page.goto('http://localhost:3000/swipe');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/manual-desktop-3-final.png' });
    console.log('✓ Desktop test complete');
  });

  test('Check hamburger menu on mobile and spacing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/swipe');
    await page.waitForSelector('header');
    await page.waitForTimeout(1000);

    console.log('📱 Mobile - Before opening menu');
    await page.screenshot({ path: 'test-results/manual-mobile-menu-1-closed.png' });

    // Click hamburger
    const hamburger = page.locator('button[aria-label*="menu"]').first();
    const isVisible = await hamburger.isVisible();
    console.log('✓ Hamburger menu visible:', isVisible);

    if (isVisible) {
      await hamburger.click();
      await page.waitForTimeout(800);

      console.log('📱 Mobile - Menu opened');
      await page.screenshot({ path: 'test-results/manual-mobile-menu-2-open.png' });

      // Check menu items are accessible
      const menuItems = page.locator('nav a').or(page.locator('nav button'));
      const count = await menuItems.count();
      console.log('✓ Menu items visible:', count);
    }
  });
});
