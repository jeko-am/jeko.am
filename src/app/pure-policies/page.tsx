"use client";

import Link from "next/link";
import LegalPageRenderer from "@/components/LegalPageRenderer";
import { useT } from "@/lib/i18n/LangProvider";

export default function PurePoliciesPage() {
  const { t } = useT();
  const policies = [
    { title: t("policy.privacy.title"),  description: "How we collect, use, and protect your personal information when you use our website and services.", href: "/privacy-policy" },
    { title: t("policy.terms.title"),    description: "The terms governing your use of our website, account creation, orders, and subscriptions.", href: "/terms-of-use" },
    { title: t("policy.cookies.title"),  description: "Information about the cookies we use, why we use them, and how you can manage your preferences.", href: "/cookie-policy" },
    { title: t("policy.refund.title"),   description: "Our 30-day satisfaction guarantee and the process for requesting refunds on your orders.", href: "/refund-policy" },
    { title: t("policy.shipping.title"), description: "Delivery options, timescales, costs, and everything you need to know about how we ship your orders.", href: "/shipping-policy" },
    { title: t("policy.returns.title"),  description: "How to return products, our return process, and what to expect when requesting a return.", href: "/returns" },
    { title: t("policy.security.title"), description: "How we protect your data, secure your payments, and keep your shopping experience safe.", href: "/site-security" },
  ];

  return (
    <LegalPageRenderer
      slug="/pure-policies"
      fallbackHeading={t("policy.pure.heading")}
      fallbackHeadingHighlight={t("policy.pure.headingHighlight")}
      fallbackSubtitle={t("policy.pure.subtitle")}
      fallbackBody={
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
                {t("policy.pure.readPolicy")} &rarr;
              </span>
            </Link>
          ))}
        </div>
      }
    />
  );
}
