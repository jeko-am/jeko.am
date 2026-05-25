"use client";

import { useT } from "./LangProvider";

type AnyContent = Record<string, unknown> | null | undefined;

/**
 * Returns a helper `ct(key, fallbackDictKey?)` that reads store-editor content
 * with per-language overrides. Store editor writes content as:
 *   { heading: "English...", hy: { heading: "Հայերեն..." }, ...rest }
 *
 * Lookup order when lang === "hy":
 *   1. content.hy.key (admin-provided Armenian) — wins even when intentionally blank
 *   2. content.key (English fallback, only if no Armenian field exists)
 *
 * Lookup order when lang === "en":
 *   1. content.key (admin-provided English) — wins even when intentionally blank
 *
 * The fallbackDictKey argument is kept for backwards-compatible call sites,
 * but editor-controlled fields must not resurrect static copy after the admin
 * clears a field.
 */
export function useContentT(content: AnyContent) {
  const { lang, t } = useT();

  function ct(key: string, _fallbackDictKey?: string): string {
    if (lang === "hy") {
      if (content) {
        const hy = (content as { hy?: Record<string, unknown> }).hy;
        if (hy && Object.prototype.hasOwnProperty.call(hy, key)) {
          const hyVal = hy[key];
          if (typeof hyVal === "string") return hyVal;
        }
        const c = content as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(c, key)) {
          const enVal = c[key];
          if (typeof enVal === "string") return enVal;
        }
      }
    } else {
      if (content) {
        const c = content as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(c, key)) {
          const enVal = c[key];
          if (typeof enVal === "string") return enVal;
        }
      }
    }
    return "";
  }

  return { ct, t, lang };
}
