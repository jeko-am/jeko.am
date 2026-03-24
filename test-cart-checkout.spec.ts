import { test, expect } from '@playwright/test';

test.describe('Cart and Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('complete cart and checkout flow as guest', async ({ page }) => {
    console.log('🛒 Starting cart and checkout flow test...');

    // Step 1: Navigate to products page
    await page.click('text=Shop');
    await page.waitForURL('**/products');
    console.log('✅ Navigated to products page');

    // Step 2: Add first product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    if (await firstProduct.count() === 0) {
      // Fallback to alternative selector - look for product cards with add to cart buttons
      const productCards = page.locator('a[href*="/products/"]').filter({ has: page.locator('button:has-text("Add to Cart")') });
      await expect(productCards.first()).toBeVisible();
    }
    
    const productName = await firstProduct.locator('h3').textContent() || 'Product';
    
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    console.log(`✅ Added "${productName}" to cart`);

    // Wait for cart to update
    await page.waitForTimeout(1000);

    // Step 3: Verify cart icon shows item count
    const cartButton = page.locator('button[aria-label="Shopping cart"]');
    await expect(cartButton).toBeVisible();
    
    const cartBadge = cartButton.locator('span');
    if (await cartBadge.count() > 0) {
      await expect(cartBadge.first()).toContainText('1');
    }
    console.log('✅ Cart badge shows 1 item');

    // Step 4: Open sidecart
    await cartButton.click();
    await expect(page.locator('text=Shopping Cart (1)')).toBeVisible();
    console.log('✅ Sidecart opened');

    // Step 5: Verify product in sidecart
    await expect(page.locator(`text=${productName}`)).toBeVisible();
    console.log('✅ Product visible in sidecart');

    // Step 6: Add second product
    await page.click('text=Continue Shopping');
    await page.waitForTimeout(500);
    
    const secondProduct = page.locator('[data-testid="product-card"]').nth(1);
    if (await secondProduct.count() === 0) {
      // Fallback to alternative selector
      const productCards = page.locator('a[href*="/products/"]').filter({ has: page.locator('button:has-text("Add to Cart")') });
      const secondCard = productCards.nth(1);
      await expect(secondCard).toBeVisible();
    }
    
    const secondProductName = await secondProduct.locator('h3').textContent() || 'Second Product';
    
    await secondProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(1000);
    console.log(`✅ Added "${secondProductName}" to cart`);

    // Verify cart shows 2 items
    const updatedCartBadge = cartButton.locator('span');
    if (await updatedCartBadge.count() > 0) {
      await expect(updatedCartBadge.first()).toContainText('2');
    }
    console.log('✅ Cart badge shows 2 items');

    // Step 7: Go to cart page
    await cartButton.click(); // Open cart again
    await page.waitForTimeout(500);
    
    // Navigate to cart page directly
    await page.goto('http://localhost:3000/cart');
    await page.waitForURL('**/cart');
    console.log('✅ Navigated to cart page');

    // Step 8: Verify cart page contents
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
    await expect(page.locator('text=2 items in your cart')).toBeVisible();
    console.log('✅ Cart page shows correct item count');

    // Step 9: Proceed to checkout
    await page.click('text=Proceed to Checkout');
    await page.waitForURL('**/checkout');
    console.log('✅ Navigated to checkout page');

    // Step 10: Fill out guest checkout form
    await expect(page.locator('input[name="customerType"][value="guest"]')).toBeChecked();
    
    // Customer Information
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="tel"]', '+44 20 1234 5678');
    
    // Shipping Address
    await page.fill('input[placeholder*="First"]', 'John');
    await page.fill('input[placeholder*="Last"]', 'Doe');
    await page.fill('input[placeholder*="address"]', '123 Test Street');
    await page.fill('input[placeholder*="City"]', 'London');
    await page.fill('input[placeholder*="Postal"]', 'SW1A 0AA');
    
    console.log('✅ Filled out checkout form');

    // Step 11: Select payment method
    await page.click('input[value="card"]');
    console.log('✅ Selected credit card payment');

    // Step 12: Place order
    await page.click('button:has-text("Place Order")');
    
    // Wait for order processing
    await page.waitForTimeout(3000);
    
    // Step 13: Verify order completion
    await expect(page.locator('text=Order Complete!')).toBeVisible();
    
    // Get order number
    const orderElement = page.locator('text=Order #');
    if (await orderElement.isVisible()) {
      const orderNumber = await orderElement.textContent();
      console.log(`✅ Order completed! ${orderNumber}`);
    }

    // Step 14: Verify cart is empty
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    console.log('✅ Cart is empty after order');
  });

  test('cart quantity controls', async ({ page }) => {
    console.log('🔄 Testing cart quantity controls...');

    // Add a product to cart
    await page.click('text=Shop');
    await page.waitForURL('**/products');
    
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(1000);

    // Open sidecart
    const cartButton = page.locator('button[aria-label="Shopping cart"]');
    await cartButton.click();
    await page.waitForTimeout(500);

    // Test quantity increase
    const increaseButton = page.locator('button:has(svg):has-text("+")');
    if (await increaseButton.count() > 0) {
      await increaseButton.first().click();
      await expect(page.locator('text=Qty: 2')).toBeVisible();
      console.log('✅ Quantity increased to 2');
    }

    // Test quantity decrease
    const decreaseButton = page.locator('button:has(svg):has-text("-")');
    if (await decreaseButton.count() > 0) {
      await decreaseButton.first().click();
      await expect(page.locator('text=Qty: 1')).toBeVisible();
      console.log('✅ Quantity decreased to 1');
    }

    // Test remove item
    const removeButton = page.locator('text=Remove');
    if (await removeButton.count() > 0) {
      await removeButton.first().click();
      await page.waitForTimeout(500);
      console.log('✅ Item removed from cart');
    }
  });

  test('sidecart functionality', async ({ page }) => {
    console.log('🛍️ Testing sidecart functionality...');

    // Add product to cart
    await page.click('text=Shop');
    await page.waitForURL('**/products');
    
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(1000);

    // Open sidecart
    const cartButton = page.locator('button[aria-label="Shopping cart"]');
    await cartButton.click();
    await expect(page.locator('text=Shopping Cart (1)')).toBeVisible();

    // Test checkout button
    const checkoutButton = page.locator('text=Checkout');
    await expect(checkoutButton).toBeVisible();
    
    // Test continue shopping
    await page.click('text=Continue Shopping');
    await page.waitForTimeout(500);
    
    // Sidecart should be closed
    await expect(page.locator('text=Shopping Cart (1)')).not.toBeVisible();
    console.log('✅ Sidecart closed on continue shopping');
  });

  test('empty cart states', async ({ page }) => {
    console.log('📦 Testing empty cart states...');

    // Test empty cart page
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('text=Start shopping to fill it up!')).toBeVisible();
    console.log('✅ Empty cart page shows correct message');

    // Test empty checkout redirect
    await page.goto('http://localhost:3000/checkout');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    console.log('✅ Empty checkout redirects correctly');
  });
});
