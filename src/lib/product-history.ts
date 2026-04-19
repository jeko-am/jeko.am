const MAX_HISTORY = 12;

function storageKey(userId: string) {
  return `jeko_viewed_${userId}`;
}

export function recordProductView(userId: string, productId: string) {
  if (typeof window === 'undefined') return;
  try {
    const key = storageKey(userId);
    const raw = localStorage.getItem(key);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    // Move to front, deduplicate, cap
    const next = [productId, ...ids.filter(id => id !== productId)].slice(0, MAX_HISTORY);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function getViewedProductIds(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearViewHistory(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    // ignore
  }
}
