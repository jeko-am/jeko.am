import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "footer_vip";

    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Newsletter service is not configured" }, { status: 500 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await admin
      .from("email_subscribers")
      .upsert({
        email,
        source,
        is_subscribed: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" });

    if (error) {
      console.error("Newsletter subscribe failed:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscribe unexpected error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
