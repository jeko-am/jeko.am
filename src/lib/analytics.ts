import { supabase } from './supabase';

const SESSION_KEY = 'jeko_analytics_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

let sessionId: string | null = null;
let initialized = false;

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.id && parsed.expires > Date.now()) {
        sessionId = parsed.id;
        return parsed.id;
      }
    } catch { /* parse error - create new */ }
  }
  // Create new session
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id, expires: Date.now() + SESSION_DURATION }));
  sessionId = id;
  return id;
}

function extendSession() {
  if (sessionId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, expires: Date.now() + SESSION_DURATION }));
  }
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/.test(ua)) return 'mobile';
  if (/Tablet|iPad/.test(ua)) return 'tablet';
  return 'desktop';
}

function simpleHashIP(): string {
  // We don't have real IP in browser - use user agent + language + screen size as proxy
  const fingerprint = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`;
  return hashString(fingerprint);
}

async function upsertSession(landing: boolean = false) {
  const sid = getOrCreateSessionId();
  if (!sid) return;

  try {
    // Check if session exists
    const { data: existing } = await supabase
      .from('analytics_sessions')
      .select('id')
      .eq('session_id', sid)
      .maybeSingle();

    if (existing) {
      // Update last activity
      await supabase
        .from('analytics_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('session_id', sid);
    } else {
      // Create new session
      await supabase.from('analytics_sessions').insert({
        session_id: sid,
        ip_hash: simpleHashIP(),
        user_agent_hash: hashString(navigator.userAgent),
        landing_page: landing ? window.location.pathname : null,
        referrer: document.referrer || null,
        device_type: getDeviceType(),
        total_events: 1,
        is_bounce: true,
      });
    }
  } catch {
    // Silently fail analytics - don't block user flow
  }
}

export async function trackEvent(
  eventType: 'page_view' | 'add_to_cart' | 'checkout_start' | 'checkout_complete' | 'order_placed',
  data?: {
    pageUrl?: string;
    productId?: string;
    productName?: string;
    productPrice?: number;
    quantity?: number;
    metadata?: Record<string, unknown>;
  }
) {
  const sid = getOrCreateSessionId();
  if (!sid) return;

  extendSession();

  try {
    // Ensure session exists
    await upsertSession(eventType === 'page_view');

    await supabase.from('analytics_events').insert({
      session_id: sid,
      event_type: eventType,
      page_url: data?.pageUrl || window.location.pathname,
      product_id: data?.productId || null,
      product_name: data?.productName || null,
      product_price: data?.productPrice || null,
      quantity: data?.quantity || 1,
      metadata: data?.metadata || {},
    });
  } catch {
    // Silently fail analytics
  }
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Track page view on init
  trackEvent('page_view');

  // Track subsequent navigation (Next.js client-side)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackEvent('page_view');
    }
  });
  observer.observe(document, { subtree: true, childList: true });

  // Also listen to popstate for back/forward
  window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackEvent('page_view');
    }
  });
}
