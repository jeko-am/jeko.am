import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Server-side client (anon key is fine — only reads public data)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cached response for 5 minutes to avoid hammering Supabase
let _cached: string[] | null = null;
let _cachedAt = 0;
const TTL = 5 * 60 * 1000;

export async function GET() {
  if (_cached && Date.now() - _cachedAt < TTL) {
    return NextResponse.json({ strings: _cached });
  }

  const strings = new Set<string>();

  // Product names and short descriptions
  const { data: products } = await supabase
    .from('products')
    .select('name, short_description')
    .eq('status', 'active');
  for (const p of products ?? []) {
    if (p.name) strings.add(p.name);
    if (p.short_description) strings.add(p.short_description);
  }

  // Category names
  const { data: categories } = await supabase
    .from('categories')
    .select('name');
  for (const c of categories ?? []) {
    if (c.name) strings.add(c.name);
  }

  // Bundle names
  const { data: bundles } = await supabase
    .from('bundles')
    .select('name, short_description')
    .eq('status', 'active')
    .limit(50);
  for (const b of bundles ?? []) {
    if (b.name) strings.add(b.name);
    if (b.short_description) strings.add(b.short_description);
  }

  _cached = Array.from(strings);
  _cachedAt = Date.now();

  return NextResponse.json({ strings: _cached });
}
