import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import SideCart from "@/components/SideCart";

export const metadata: Metadata = {
  title: "Personalised Healthy Natural Dog Food - Pure Pet Food",
  description: "The easiest way to feed healthy, natural dog food. Enjoy fresh food without the fuss, from only 89p a day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
