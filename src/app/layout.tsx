import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import SideCart from "@/components/SideCart";
import ConditionalDogChatbot from "@/components/ConditionalDogChatbot";
import TrackingScripts from "@/components/TrackingScripts";
import GTMNoScript from "@/components/GTMNoScript";

export const metadata: Metadata = {
  title: "Jeko - Personalised Healthy Natural Pet Food",
  description: "The easiest way to feed healthy, natural pet food. Enjoy fresh food without the fuss.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <TrackingScripts />
      </head>
      <body className="antialiased has-bottom-nav">
        {/* Google Tag Manager (noscript) - only renders when GTM is enabled */}
        <GTMNoScript />
        <AuthProvider>
          <CartProvider>
            {children}
            <MobileNavWrapper />
            <SideCart />
            <ConditionalDogChatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
