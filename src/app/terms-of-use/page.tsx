"use client";

import LegalStructuredRenderer from "@/components/LegalStructuredRenderer";
import { useT } from "@/lib/i18n/LangProvider";
import { FALLBACK_BLOCKS } from "./blocks";

export default function TermsOfUsePage() {
  const { t } = useT();
  return (
    <LegalStructuredRenderer
      slug="/terms-of-use"
      fallbackHero={{
        heading: t("policy.terms.title"),
        subtitle: t("policy.terms.subtitle"),
        lastUpdated: "Last updated: March 2026",
      }}
      fallbackBlocks={FALLBACK_BLOCKS}
    />
  );
}
