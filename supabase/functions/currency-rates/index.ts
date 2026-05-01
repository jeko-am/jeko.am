// Supabase Edge Function: currency-rates
//
// GET  /currency-rates              -> returns the latest cached rates,
//                                      refreshing from open.er-api.com if the
//                                      cached row is older than 24h.
// POST /currency-rates              -> forces a refresh from the upstream API
//                                      and returns the new rates.
//
// Free upstream API: https://open.er-api.com/v6/latest/GBP (no key, daily).
// Base currency is GBP because the site stores prices in GBP.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BASE_CURRENCY         = 'GBP';
const CACHE_MAX_AGE_HOURS   = 24;
const UPSTREAM_URL          = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  });

async function fetchUpstream() {
  const res = await fetch(UPSTREAM_URL);
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success' || !data.rates) throw new Error('upstream payload invalid');
  return data.rates as Record<string, number>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const supa = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    const { data: cached } = await supa
      .from('currency_rates')
      .select('base, rates, fetched_at, updated_at')
      .eq('id', 1)
      .maybeSingle();

    const now = Date.now();
    const ageMs = cached?.fetched_at ? now - new Date(cached.fetched_at).getTime() : Infinity;
    const stale = ageMs > CACHE_MAX_AGE_HOURS * 3_600_000;
    const force = req.method === 'POST';

    if (!force && cached && !stale) {
      return json({ base: cached.base, rates: cached.rates, fetched_at: cached.fetched_at, cached: true });
    }

    const rates = await fetchUpstream();
    const fetched_at = new Date().toISOString();

    const { error: upErr } = await supa
      .from('currency_rates')
      .upsert({ id: 1, base: BASE_CURRENCY, rates, fetched_at, updated_at: fetched_at });
    if (upErr) throw upErr;

    return json({ base: BASE_CURRENCY, rates, fetched_at, cached: false });
  } catch (err) {
    return json({ error: String(err?.message ?? err) }, 500);
  }
});
