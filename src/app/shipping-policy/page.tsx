"use client";

import LegalStructuredRenderer from "@/components/LegalStructuredRenderer";
import { useT } from "@/lib/i18n/LangProvider";
import { FALLBACK_BLOCKS } from "./blocks";

export default function ShippingPolicyPage() {
  const { t } = useT();
  return (
    <LegalStructuredRenderer
      slug="/shipping-policy"
      fallbackHero={{
        heading: t("policy.shipping.heading"),
        headingHighlight: t("policy.shipping.headingHighlight"),
        subtitle: t("policy.shipping.subtitle"),
        lastUpdated: "Last updated: March 2026",
      }}
      fallbackBlocks={FALLBACK_BLOCKS}
    />
  );
}
