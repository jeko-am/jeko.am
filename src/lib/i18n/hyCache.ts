// Shared translation cache, registry, and pre-warming.
// Imported by both HyText and LangProvider — kept as a plain module (no React)
// so there are no circular dependency issues.

export const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

// Every EN string ever seen by a mounted HyText component.
export const registry = new Set<string>();

// Concurrent request pool (10 parallel max instead of 1-at-a-time).
let active = 0;
const MAX_CONCURRENT = 10;
const waitQueue: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) { active++; return Promise.resolve(); }
  return new Promise(resolve => waitQueue.push(() => { active++; resolve(); }));
}
function release() {
  active--;
  const next = waitQueue.shift();
  if (next) next();
}

function normalize(text: string): string {
  // "&" confuses the translate API for names like "Janet & Bunty"
  return text.replace(/ & /g, ' and ');
}

/** Translate a single string, concurrent up to MAX_CONCURRENT. */
export async function translateOne(text: string): Promise<string | null> {
  if (!text) return null;
  const hit = cache.get(text);
  if (hit !== undefined) return hit;
  const existing = inflight.get(text);
  if (existing) return existing;

  const work = (async () => {
    await acquire();
    try {
      const norm = normalize(text);
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: norm, target: 'hy' }),
      });
      const j = (await r.json()) as { translated?: string };
      if (r.ok && j.translated && j.translated !== norm) {
        cache.set(text, j.translated);
        return j.translated;
      }
    } catch { /* noop */ } finally { release(); }
    return null;
  })();

  inflight.set(text, work);
  const result = await work;
  inflight.delete(text);
  return result;
}

let _siteWarmStarted = false;

/**
 * Background-warm all dynamic strings across the site (product names,
 * categories, bundles). Runs at most once per browser session.
 */
export async function backgroundWarmSite(): Promise<void> {
  if (_siteWarmStarted || typeof window === 'undefined') return;
  _siteWarmStarted = true;
  try {
    const r = await fetch('/api/translate/site-strings');
    if (!r.ok) return;
    const j = (await r.json()) as { strings?: string[] };
    if (Array.isArray(j.strings) && j.strings.length > 0) {
      await prewarm(j.strings);
    }
  } catch { /* noop */ }
}

/**
 * Batch-translate all given texts in one round-trip via /api/translate/batch.
 * Falls back to individual concurrent requests for anything the batch misses.
 */
export async function prewarm(texts: string[]): Promise<void> {
  const todo = texts.filter(t => t && t.length > 0 && !cache.has(t) && !inflight.has(t));
  if (!todo.length) return;

  try {
    const r = await fetch('/api/translate/batch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ texts: todo.map(normalize), target: 'hy' }),
    });
    if (r.ok) {
      const j = (await r.json()) as { translations: string[] };
      todo.forEach((orig, i) => {
        const tx = j.translations?.[i];
        if (tx && tx !== normalize(orig)) cache.set(orig, tx);
      });
    }
  } catch { /* noop */ }

  // Any that the batch missed — fire concurrently as fallback
  const missed = todo.filter(t => !cache.has(t));
  if (missed.length) await Promise.all(missed.map(translateOne));
}
