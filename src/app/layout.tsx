import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import SideCart from "@/components/SideCart";

export const metadata: Metadata = {
  title: "Jeko - Personalised Healthy Natural Pet Food",
  description: "The easiest way to feed healthy, natural pet food. Enjoy fresh food without the fuss.",
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
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased has-bottom-nav">
        <AuthProvider>
          <CartProvider>
            {children}
            <MobileNavWrapper />
            <SideCart />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
