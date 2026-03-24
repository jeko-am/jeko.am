import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for admin routes.
 *
 * Supabase JS stores auth tokens in localStorage (not cookies), so we cannot
 * verify the session server-side in edge middleware without @supabase/ssr.
 * Instead, the admin layout (src/app/admin/layout.tsx) handles client-side
 * auth gating — redirecting unauthenticated or non-admin users to login.
 *
 * This middleware adds security headers for admin routes.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers for admin pages
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
