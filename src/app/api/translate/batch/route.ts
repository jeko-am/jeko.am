import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Re-use the same Google Translate logic from the single endpoint.
async function translateGoogle(text: string, target: string): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    const arr = Array.isArray(json) ? (json as unknown[]) : null;
    const first = arr && Array.isArray(arr[0]) ? (arr[0] as unknown[]) : null;
    if (!first) return null;
    let out = '';
    for (const part of first) {
      if (Array.isArray(part) && typeof part[0] === 'string') out += part[0];
    }
    return out || null;
  } catch { return null; }
}

// Process-wide cache shared conceptually with the single-translate route.
const __batchCache = new Map<string, string>();

async function translateOne(text: string, target: string): Promise<string> {
  const key = `${target}::${text}`;
  const hit = __batchCache.get(key);
  if (hit) return hit;
  const out = (await translateGoogle(text, target)) ?? text;
  __batchCache.set(key, out);
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const { texts, target = 'hy' } = (await req.json()) as { texts?: string[]; target?: string };
    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: 'texts array required' }, { status: 400 });
    }
    if (!/^[a-z-]{2,5}$/.test(target)) {
      return NextResponse.json({ error: 'invalid target' }, { status: 400 });
    }
    // Translate all in parallel on the server — server has no rate-limit concern here.
    const translations = await Promise.all(
      texts.map(t => typeof t === 'string' && t.length > 0 ? translateOne(t, target) : Promise.resolve(t))
    );
    return NextResponse.json({ translations });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'batch translate failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
