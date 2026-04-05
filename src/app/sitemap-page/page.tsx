"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const sitemapSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Recipes", href: "/recipes" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "About Jeko",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Community", href: "/community" },
      { label: "Beyond the Bowl", href: "/beyond-the-bowl" },
    ],
  },
  {
    title: "Health & Benefits",
    links: [
      { label: "Benefits Overview", href: "/benefits" },
      { label: "Digestion Issues", href: "/benefits/digestion-issues" },
      { label: "Weight Management", href: "/benefits/weight-management" },
      { label: "Hypoallergenic", href: "/benefits/hypoallergenic" },
      { label: "Pancreatitis", href: "/benefits/pancreatitis" },
      { label: "Colitis", href: "/benefits/colitis" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Delivery Information", href: "/delivery-information" },
      { label: "Returns", href: "/returns" },
      { label: "My Account", href: "/profile" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-of-use" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Jeko Policies", href: "/pure-policies" },
      { label: "Site Security", href: "/site-security" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              Site<span className="text-gold">map</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              Find your way around the Jeko website.
            </p>
          </div>
        </section>

        {/* Sitemap Content */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {sitemapSections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-deep-green font-rubik font-bold text-xl mb-4 pb-2 border-b-2 border-gold/30">
                    {section.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-deep-green/70 hover:text-deep-green transition-colors text-[15px]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
