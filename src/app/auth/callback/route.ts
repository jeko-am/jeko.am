import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth callback route.
 *
 * We deliberately do NOT exchange the code server-side because the browser's
 * Supabase client stores sessions in localStorage (not cookies). A server-side
 * exchange would create a session the browser can never see.
 *
 * Instead we forward the code to a client-side page that calls
 * `supabase.auth.exchangeCodeForSession(code)` in the browser, ensuring the
 * session lands in localStorage where the rest of the app expects it.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '';

  // Always forward to the client-side callback page so it can process
  // quiz data from sessionStorage. Works for both PKCE (code in query)
  // and implicit (token in hash — browser preserves the fragment across
  // redirects per RFC 7231 §7.1.2).
  const target = new URL('/auth/callback/complete', requestUrl.origin);
  if (code) target.searchParams.set('code', code);
  if (next) target.searchParams.set('next', next);
  return NextResponse.redirect(target);
}
