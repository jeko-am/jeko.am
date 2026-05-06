"use client";

import LegalStructuredRenderer from "@/components/LegalStructuredRenderer";
import { useT } from "@/lib/i18n/LangProvider";
import { FALLBACK_BLOCKS } from "./blocks";

export default function CookiePolicyPage() {
  const { t } = useT();
  return (
    <LegalStructuredRenderer
      slug="/cookie-policy"
      fallbackHero={{
        heading: t("policy.cookies.title"),
        subtitle: t("policy.cookies.subtitle"),
        lastUpdated: "Last updated: March 2026",
      }}
      fallbackBlocks={FALLBACK_BLOCKS}
    />
  );
}
