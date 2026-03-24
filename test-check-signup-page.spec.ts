import { test } from '@playwright/test';

test('Check signup page structure', async ({ page }) => {
  console.log('\n🔎 CHECKING SIGNUP PAGE STRUCTURE\n');

  await page.goto('http://localhost:3000/auth/signup');
  await page.waitForSelector('input', { timeout: 10000 });

  console.log('✓ Signup page loaded');

  // Get all input fields
  const inputs = await page.locator('input').allTextContents();
  console.log(`✓ Found ${inputs.length} input elements\n`);

  // Get labels to understand form structure
  const labels = await page.locator('label').allTextContents();
  console.log('📋 Form labels:');
  labels.forEach((label, i) => {
    if (label.trim()) console.log(`   ${i}: "${label.trim()}"`);
  });

  // Check for specific input IDs
  console.log('\n📋 Input IDs:');
  const inputIds = await page.locator('input[id]').evaluateAll(inputs =>
    inputs.map(i => (i as HTMLInputElement).id)
  );
  inputIds.forEach(id => console.log(`   - ${id}`));

  // Try to find Full Name input
  const fullNameInput = page.locator('#fullName, input[name="fullName"]');
  const exists = await fullNameInput.count();
  console.log(`\n✓ Full Name input exists: ${exists > 0}`);

  // Take screenshot
  await page.screenshot({ path: 'test-results/signup-page-structure.png' });

  // Check current step
  const stepText = await page.locator('text=Step').textContent();
  console.log(`✓ Current step: ${stepText || 'Unknown'}`);
});
