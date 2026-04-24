import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function extractIp(req: NextRequest): string | null {
  // Vercel / standard forwarding headers
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const cfip = req.headers.get("cf-connecting-ip");
  if (cfip) return cfip.trim();
  return null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80")
  );
}

async function lookupGeo(ip: string): Promise<{
  city: string | null;
  region: string | null;
  country: string | null;
} | null> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success === false) return null;
    return {
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country ?? null,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ ok: false, error: "server misconfigured" }, { status: 500 });
  }

  let body: { session_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
  }
  const sessionId = body.session_id?.trim();
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "session_id required" }, { status: 400 });
  }

  const ip = extractIp(req);
  const geo = ip && !isPrivateIp(ip) ? await lookupGeo(ip) : null;

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const update: Record<string, string | null> = {
    ip_address: ip,
    city: geo?.city ?? null,
    region: geo?.region ?? null,
    country: geo?.country ?? null,
  };

  const { error } = await admin
    .from("analytics_sessions")
    .update(update)
    .eq("session_id", sessionId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ip, ...geo });
}
