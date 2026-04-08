import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Login mode: check if user has completed signup (has a profile)
    if (next === 'login' && data?.session?.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', data.session.user.id)
        .single();

      if (!profile) {
        // No profile — user hasn't signed up, sign them out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/login?error=not_signed_up', requestUrl.origin));
      }
      // Profile exists — login successful
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    // Signup mode: redirect back to signup page to complete profile saving
    if (next === 'signup') {
      return NextResponse.redirect(new URL('/auth/signup?completing=1', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/community', requestUrl.origin));
}
