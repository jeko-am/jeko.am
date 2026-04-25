import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import SideCart from "@/components/SideCart";
import ConditionalDogChatbot from "@/components/ConditionalDogChatbot";
import TrackingScripts from "@/components/TrackingScripts";
import AnalyticsInit from "@/components/AnalyticsInit";
import GTMNoScript from "@/components/GTMNoScript";
import { LangProvider } from "@/lib/i18n/LangProvider";
import TranslationsBootstrap from "@/lib/i18n/TranslationsBootstrap";
import { getServerLang } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Jeko - Personalised Healthy Natural Pet Food",
  description: "The easiest way to feed healthy, natural pet food. Enjoy fresh food without the fuss.",
  icons: {
    icon: "/favicon.svg",
  },
};

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
          <AuthProvider>
            <CartProvider>
              <AnalyticsInit />
              {children}
              <MobileNavWrapper />
              <SideCart />
              <ConditionalDogChatbot />
            </CartProvider>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
