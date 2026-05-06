"use client";

import LegalStructuredRenderer from "@/components/LegalStructuredRenderer";
import { useT } from "@/lib/i18n/LangProvider";
import { FALLBACK_BLOCKS } from "./blocks";

export default function PrivacyPolicyPage() {
  const { t } = useT();
  const titleParts = t("policy.privacy.title").split(" ");
  return (
    <LegalStructuredRenderer
      slug="/privacy-policy"
      fallbackHero={{
        heading: titleParts[0],
        headingHighlight: titleParts.slice(1).join(" "),
        subtitle: t("policy.privacy.subtitle"),
        lastUpdated: "Last updated: March 2026",
      }}
      fallbackBlocks={FALLBACK_BLOCKS}
    />
  );
}
