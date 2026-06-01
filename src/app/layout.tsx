import type { Metadata } from "next";
import "./globals.css";
import { createSupabaseClientWithTimeout } from "@/lib/supabase-timeout";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import { CurrencyProvider } from "@/lib/currency";
import SiteThemeBootstrap from "@/components/SiteThemeBootstrap";
import CustomFontsBootstrap from "@/components/CustomFontsBootstrap";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import SideCart from "@/components/SideCart";
import ConditionalDogChatbot from "@/components/ConditionalDogChatbot";
import TrackingScripts from "@/components/TrackingScripts";
import AnalyticsInit from "@/components/AnalyticsInit";
import GTMNoScript from "@/components/GTMNoScript";
import StoreEditorStyleBridge from "@/components/StoreEditorStyleBridge";
import { LangProvider } from "@/lib/i18n/LangProvider";
import TranslationsBootstrap from "@/lib/i18n/TranslationsBootstrap";
import { getServerLang } from "@/lib/i18n/server";

/**
 * Site-wide metadata is pulled from CMS:
 *   - site_settings.site_name        → <title>
 *   - site_settings.site_description → meta description
 *   - site_settings.favicon          → favicon URL
 *   - the "SEO" editor page (slug "seo-tracking", section 0) → og_image + overrides
 * Falls back to the original Jeko strings when no rows exist.
 */
export async function generateMetadata(): Promise<Metadata> {
  const fallback: Metadata = {
    title: "Jeko.am",
    description: "The easiest way to feed healthy, natural pet food. Enjoy fresh food without the fuss.",
    icons: { icon: "/favicon.svg" },
  };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;
  try {
    const supa = createSupabaseClientWithTimeout(url, key, 2000);
    const [settingsRes, seoPageRes] = await Promise.all([
      supa.from("site_settings").select("key,value"),
      supa.from("pages").select("id").eq("slug", "seo-tracking").maybeSingle(),
    ]);
    const settings = new Map<string, unknown>();
    settingsRes.data?.forEach((r: { key: string; value: unknown }) => settings.set(r.key, r.value));

    let seoOverride: Record<string, unknown> = {};
    const seoPageId = (seoPageRes.data as { id?: string } | null)?.id;
    if (seoPageId) {
      const { data: secs } = await supa
        .from("page_sections")
        .select("content")
        .eq("page_id", seoPageId);
      secs?.forEach((row: { content: Record<string, unknown> }) => {
        if (row.content?._section_index === 0) seoOverride = row.content;
      });
    }

    const title = String(seoOverride.site_title || settings.get("site_name") || fallback.title || "");
    const description = String(seoOverride.site_description || settings.get("site_description") || fallback.description || "");
    const rawOg = seoOverride.og_image;
    const ogImage: string = typeof rawOg === "string" && rawOg ? rawOg : "";
    const rawFavicon = settings.get("favicon");
    const favicon: string = typeof rawFavicon === "string" && rawFavicon ? rawFavicon : "/favicon.svg";

    return {
      title,
      description,
      icons: { icon: favicon },
      openGraph: ogImage
        ? { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] }
        : { title, description },
      twitter: ogImage
        ? { card: "summary_large_image", title, description, images: [ogImage] }
        : { card: "summary", title, description },
    };
  } catch {
    return fallback;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getServerLang();
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <TrackingScripts />
      </head>
      <body className="antialiased has-bottom-nav">
        {/* Google Tag Manager (noscript) - only renders when GTM is enabled */}
        <GTMNoScript />
        <LangProvider initialLang={lang}>
          <TranslationsBootstrap />
          <SiteThemeBootstrap />
          <CustomFontsBootstrap />
          <StoreEditorStyleBridge />
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <AnalyticsInit />
                {children}
                <MobileNavWrapper />
                <SideCart />
                <ConditionalDogChatbot />
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
