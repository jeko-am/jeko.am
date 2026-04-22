/**
 * Analytics event tracking utility.
 * Fires events to all configured pixels (Facebook, GA4, GTM, TikTok).
 * If no pixels are configured, all calls are no-ops.
 */
import { trackEvent } from './analytics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = (typeof window !== 'undefined' ? window : {}) as any;

// ─── Helpers ────────────────────────────────────────────────────────────────

function fbq(...args: unknown[]) {
  if (typeof w.fbq === 'function') w.fbq(...args);
}

function gtag(...args: unknown[]) {
  if (typeof w.gtag === 'function') w.gtag(...args);
}

function ttq(method: string, ...args: unknown[]) {
  if (w.ttq && typeof w.ttq[method] === 'function') w.ttq[method](...args);
}

function pushDataLayer(obj: Record<string, unknown>) {
  if (Array.isArray(w.dataLayer)) w.dataLayer.push(obj);
}

// ─── Item type for e-commerce events ────────────────────────────────────────

export interface TrackingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  variant?: string;
}

// ─── Events ─────────────────────────────────────────────────────────────────

/** Track when a user views a product page */
export function trackViewContent(item: TrackingItem) {
  // Facebook
  fbq('track', 'ViewContent', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price,
    currency: 'GBP',
  });

  // GA4
  gtag('event', 'view_item', {
    currency: 'GBP',
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: 1 }],
  });

  // TikTok
  ttq('track', 'ViewContent', {
    content_id: item.id,
    content_name: item.name,
    value: item.price,
    currency: 'GBP',
  });

  // GTM dataLayer
  pushDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'GBP',
      value: item.price,
      items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: 1 }],
    },
  });
}

/** Track when a user adds an item to cart */
export function trackAddToCart(item: TrackingItem) {
  // Facebook
  fbq('track', 'AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price,
    currency: 'GBP',
  });

  // GA4
  gtag('event', 'add_to_cart', {
    currency: 'GBP',
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
  });

  // TikTok
  ttq('track', 'AddToCart', {
    content_id: item.id,
    content_name: item.name,
    value: item.price,
    currency: 'GBP',
    quantity: item.quantity,
  });

  // GTM dataLayer
  pushDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'GBP',
      value: item.price * item.quantity,
      items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
    },
  });

  // Jeko internal analytics
  trackEvent('add_to_cart', {
    productId: item.id,
    productName: item.name,
    productPrice: item.price,
    quantity: item.quantity,
  });
}

/** Track when a user begins checkout */
export function trackInitiateCheckout(items: TrackingItem[], total: number) {
  const contentIds = items.map(i => i.id);

  // Facebook
  fbq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    num_items: items.length,
    value: total,
    currency: 'GBP',
  });

  // GA4
  gtag('event', 'begin_checkout', {
    currency: 'GBP',
    value: total,
    items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });

  // TikTok
  ttq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    value: total,
    currency: 'GBP',
  });

  // GTM dataLayer
  pushDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'GBP',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
    },
  });

  // Jeko internal analytics
  trackEvent('checkout_start', {
    productId: items[0]?.id,
    productName: items[0]?.name,
    metadata: { itemCount: items.length, total },
  });
}

/** Track a completed purchase */
export function trackPurchase(orderNumber: string, items: TrackingItem[], total: number) {
  const contentIds = items.map(i => i.id);

  // Facebook
  fbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    num_items: items.length,
    value: total,
    currency: 'GBP',
  });

  // GA4
  gtag('event', 'purchase', {
    transaction_id: orderNumber,
    currency: 'GBP',
    value: total,
    items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });

  // TikTok
  ttq('track', 'CompletePayment', {
    content_ids: contentIds,
    value: total,
    currency: 'GBP',
  });

  // GTM dataLayer
  pushDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderNumber,
      currency: 'GBP',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
    },
  });

  // Jeko internal analytics
  trackEvent('checkout_complete', {
    productId: items[0]?.id,
    productName: items[0]?.name,
    metadata: { orderNumber, itemCount: items.length, total },
  });
}
