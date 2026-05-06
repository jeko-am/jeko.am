"use client";

import LegalStructuredRenderer from "@/components/LegalStructuredRenderer";
import { useT } from "@/lib/i18n/LangProvider";
import { FALLBACK_BLOCKS } from "./blocks";

export default function RefundPolicyPage() {
  const { t } = useT();
  return (
    <LegalStructuredRenderer
      slug="/refund-policy"
      fallbackHero={{
        heading: t("policy.refund.heading"),
        headingHighlight: t("policy.refund.headingHighlight"),
        subtitle: t("policy.refund.subtitle"),
        lastUpdated: "Last updated: March 2026",
      }}
      fallbackBlocks={FALLBACK_BLOCKS}
    />
  );
}
