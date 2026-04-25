import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Body = { text?: string; target?: string };

// Process-wide cache so we never re-translate the same string.
const __serverCache = new Map<string, string>();

async function translateMyMemory(text: string, target: string): Promise<string | null> {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `en|${target}`);
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { responseData?: { translatedText?: string } };
    return json.responseData?.translatedText ?? null;
  } catch {
    return null;
  }
}

async function translateLibre(text: string, target: string): Promise<string | null> {
  // libretranslate.de is free, public, no key required.
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'text' }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { translatedText?: string };
    return json.translatedText ?? null;
  } catch {
    return null;
  }
}

async function translateGoogle(text: string, target: string): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    // Response shape: [[["translated","source", ...], ...], ...]
    const arr = Array.isArray(json) ? (json as unknown[]) : null;
    const first = arr && Array.isArray(arr[0]) ? (arr[0] as unknown[]) : null;
    if (!first) return null;
    let out = '';
    for (const part of first) {
      if (Array.isArray(part) && typeof part[0] === 'string') out += part[0];
    }
    return out || null;
  } catch {
    return null;
  }
}

async function translateLingva(text: string, target: string): Promise<string | null> {
  try {
    const res = await fetch(`https://lingva.ml/api/v1/en/${target}/${encodeURIComponent(text)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { translation?: string };
    return json.translation ?? null;
  } catch {
    return null;
  }
}

async function translateChunk(text: string, target: string): Promise<string> {
  const key = `${target}::${text}`;
  const hit = __serverCache.get(key);
  if (hit) return hit;
  // Try most-reliable providers first; gracefully fall through.
  let out = await translateGoogle(text, target);
  if (!out) out = await translateLingva(text, target);
  if (!out) out = await translateMyMemory(text, target);
  if (!out) out = await translateLibre(text, target);
  if (!out) out = text; // Last resort — return source so UI still renders something.
  __serverCache.set(key, out);
  return out;
}

function chunkText(input: string, max = 450): string[] {
  if (input.length <= max) return [input];
  const parts: string[] = [];
  const sentences = input.split(/(?<=[.!?\n])\s+/);
  let buf = '';
  for (const s of sentences) {
    if ((buf + ' ' + s).trim().length > max) {
      if (buf) parts.push(buf.trim());
      if (s.length > max) {
        for (let i = 0; i < s.length; i += max) parts.push(s.slice(i, i + max));
        buf = '';
      } else buf = s;
    } else {
      buf = buf ? buf + ' ' + s : s;
    }
  }
  if (buf) parts.push(buf.trim());
  return parts;
}

export async function POST(req: NextRequest) {
  try {
    const { text, target = 'hy' } = (await req.json()) as Body;
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }
    if (!/^[a-z-]{2,5}$/.test(target)) {
      return NextResponse.json({ error: 'invalid target' }, { status: 400 });
    }
    const chunks = chunkText(text);
    // Serialize to be friendly to upstream rate limits.
    const out: string[] = [];
    for (const c of chunks) out.push(await translateChunk(c, target));
    return NextResponse.json({ translated: out.join(' ') });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'translate failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
