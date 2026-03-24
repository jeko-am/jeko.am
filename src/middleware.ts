import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page through
  if (pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  // Get the Supabase access token from cookies
  const accessToken =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`)?.value;

  // Try to parse the auth token from the Supabase auth cookie
  let token: string | null = null;

  // Supabase stores auth in a cookie like sb-<ref>-auth-token
  const allCookies = request.cookies.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes("auth-token")) {
      try {
        // The cookie might be a JSON array with the access token at index 0
        const parsed = JSON.parse(cookie.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          token = parsed[0];
        } else if (typeof parsed === "string") {
          token = parsed;
        } else if (parsed?.access_token) {
          token = parsed.access_token;
        }
      } catch {
        // Could be a plain token string
        if (cookie.value && cookie.value.startsWith("ey")) {
          token = cookie.value;
        }
      }
      if (token) break;
    }
  }

  if (!token && accessToken) {
    token = accessToken;
  }

  if (!token) {
    // No auth token — redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token and check admin role using the service role key
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get the user from the JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    const { data: adminRow } = await supabaseAdmin
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!adminRow || !["super_admin", "admin", "editor"].includes(adminRow.role)) {
      // User is authenticated but not an admin — show 403
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head><title>403 Forbidden</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5">
  <div style="text-align:center;padding:2rem">
    <h1 style="color:#274C46;font-size:3rem;margin:0">403</h1>
    <p style="color:#666;margin:1rem 0">You don't have permission to access the admin panel.</p>
    <a href="/" style="color:#F2A900;text-decoration:none;font-weight:600">Go to homepage</a>
  </div>
</body>
</html>`,
        { status: 403, headers: { "Content-Type": "text/html" } }
      );
    }

    // Admin verified — proceed
    return NextResponse.next();
  } catch {
    // On error, let client-side handle it
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
