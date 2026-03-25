"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const policies = [
  {
    title: "Privacy Policy",
    description:
      "How we collect, use, and protect your personal information when you use our website and services.",
    href: "/privacy-policy",
  },
  {
    title: "Terms & Conditions",
    description:
      "The terms governing your use of our website, account creation, orders, and subscriptions.",
    href: "/terms-of-use",
  },
  {
    title: "Cookie Policy",
    description:
      "Information about the cookies we use, why we use them, and how you can manage your preferences.",
    href: "/cookie-policy",
  },
  {
    title: "Refund Policy",
    description:
      "Our 30-day satisfaction guarantee and the process for requesting refunds on your orders.",
    href: "/refund-policy",
  },
  {
    title: "Shipping Policy",
    description:
      "Delivery options, timescales, costs, and everything you need to know about how we ship your orders.",
    href: "/shipping-policy",
  },
  {
    title: "Returns",
    description:
      "How to return products, our return process, and what to expect when requesting a return.",
    href: "/returns",
  },
  {
    title: "Site Security",
    description:
      "How we protect your data, secure your payments, and keep your shopping experience safe.",
    href: "/site-security",
  },
];

export default function PurePoliciesPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              Pure <span className="text-gold">Policies</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              All our policies in one place. We believe in transparency, so
              here&apos;s everything you need to know.
            </p>
          </div>
        </section>

        {/* Policies Grid */}
        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((policy) => (
                <Link
                  key={policy.title}
                  href={policy.href}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-deep-green/20 transition-all group"
                >
                  <h3 className="text-deep-green font-rubik font-bold text-lg mb-2 group-hover:text-deep-green/80 transition-colors">
                    {policy.title}
                  </h3>
                  <p className="text-deep-green/60 text-[15px] leading-relaxed mb-3">
                    {policy.description}
                  </p>
                  <span className="text-deep-green font-semibold text-sm">
                    Read policy &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
