"use client";

import { useT } from "./LangProvider";

type AnyContent = Record<string, unknown> | null | undefined;

/**
 * Returns a helper `ct(key, fallbackDictKey?)` that reads store-editor content
 * with per-language overrides. Store editor writes content as:
 *   { heading: "English...", hy: { heading: "Հայերեն..." }, ...rest }
 *
 * Lookup order when lang === "hy":
 *   1. content.hy.key (admin-provided Armenian) — wins if set
 *   2. t(fallbackDictKey) from the static Armenian dictionary — wins over English content
 *   3. content.key (English fallback, only if no Armenian anywhere)
 *
 * Lookup order when lang === "en":
 *   1. content.key (admin-provided English) — wins
 *   2. t(fallbackDictKey) from the English dictionary
 */
export function useContentT(content: AnyContent) {
  const { lang, t } = useT();

  function ct(key: string, fallbackDictKey?: string): string {
    if (lang === "hy") {
      if (content) {
        const hy = (content as { hy?: Record<string, unknown> }).hy;
        const hyVal = hy?.[key];
        if (typeof hyVal === "string" && hyVal.length > 0) return hyVal;
      }
      if (fallbackDictKey) {
        const dict = t(fallbackDictKey);
        // dict returns the key itself if missing — only use it when we actually have a translation
        if (dict && dict !== fallbackDictKey) return dict;
      }
      // No Armenian found anywhere — show English content as last resort
      if (content) {
        const enVal = (content as Record<string, unknown>)[key];
        if (typeof enVal === "string" && enVal.length > 0) return enVal;
      }
    } else {
      if (content) {
        const enVal = (content as Record<string, unknown>)[key];
        if (typeof enVal === "string" && enVal.length > 0) return enVal;
      }
      if (fallbackDictKey) return t(fallbackDictKey);
    }
    return "";
  }

  return { ct, t, lang };
}
