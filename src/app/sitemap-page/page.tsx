"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useT } from "@/lib/i18n/LangProvider";

export default function SitemapPage() {
  const { t } = useT();
  const sitemapSections = [
    {
      title: t("sitemap.section.shop"),
      links: [
        { label: t("footer.link.allProducts"), href: "/products" },
        { label: t("header.nav.recipes"), href: "/recipes" },
        { label: t("header.nav.cart"), href: "/cart" },
        { label: t("checkout.title"), href: "/checkout" },
      ],
    },
    {
      title: t("sitemap.section.about"),
      links: [
        { label: t("footer.link.ourStory"), href: "/about" },
        { label: t("header.nav.reviews"), href: "/reviews" },
        { label: t("header.nav.community"), href: "/community" },
        { label: t("header.nav.blog"), href: "/blog" },
        { label: t("beyond.title"), href: "/beyond-the-bowl" },
      ],
    },
    {
      title: t("sitemap.section.health"),
      links: [
        { label: t("header.nav.benefits"), href: "/benefits" },
        { label: t("benefits.digestion.title"), href: "/benefits/digestion-issues" },
        { label: t("benefits.weight.title"), href: "/benefits/weight-management" },
        { label: t("benefits.hypoallergenic.title"), href: "/benefits/hypoallergenic" },
        { label: t("benefits.pancreatitis.title"), href: "/benefits/pancreatitis" },
        { label: t("benefits.colitis.title"), href: "/benefits/colitis" },
      ],
    },
    {
      title: t("sitemap.section.help"),
      links: [
        { label: t("header.nav.contact"), href: "/contact" },
        { label: t("policy.delivery.title"), href: "/delivery-information" },
        { label: t("policy.returns.title"), href: "/returns" },
        { label: t("footer.links.myAccount"), href: "/profile" },
      ],
    },
    {
      title: t("sitemap.section.legal"),
      links: [
        { label: t("policy.privacy.title"), href: "/privacy-policy" },
        { label: t("policy.terms.title"), href: "/terms-of-use" },
        { label: t("policy.cookies.title"), href: "/cookie-policy" },
        { label: t("policy.refund.title"), href: "/refund-policy" },
        { label: t("policy.shipping.title"), href: "/shipping-policy" },
        { label: t("policy.pure.title"), href: "/pure-policies" },
        { label: t("policy.security.title"), href: "/site-security" },
      ],
    },
  ];

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              {t("sitemap.heading")}<span className="text-gold">{t("sitemap.headingHighlight")}</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              {t("sitemap.subtitle")}
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
