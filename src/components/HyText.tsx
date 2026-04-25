"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LangProvider";

// Per-session memo so each EN string only ever hits the translation API once.
const __cache = new Map<string, string>();
// Per-session in-flight de-dupe so the same string requested by N components only sends 1 fetch.
const __inflight = new Map<string, Promise<string | null>>();
// Single-flight queue to be friendly to upstream rate limits.
let __chain: Promise<unknown> = Promise.resolve();

export async function memoTranslateHy(text: string): Promise<string | null> {
  if (!text) return null;
  const cached = __cache.get(text);
  if (cached) return cached;
  const existing = __inflight.get(text);
  if (existing) return existing;
  const work = __chain.then(async () => {
    try {
      // Normalize & → and so the translate API can transliterate names like "Janet & Bunty"
      const normalized = text.replace(/ & /g, ' and ');
      const r = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: normalized, target: "hy" }),
      });
      const j = (await r.json()) as { translated?: string };
      if (r.ok && j.translated && j.translated !== normalized) { __cache.set(text, j.translated); return j.translated; }
    } catch { /* noop */ }
    return null;
  });
  __chain = work.catch(() => null);
  __inflight.set(text, work);
  const result = await work;
  __inflight.delete(text);
  return result;
}

export function useHyAuto(en: string | null | undefined, savedHy?: string | null): string {
  const { lang } = useT();
  const [auto, setAuto] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (lang === "hy" && en && !savedHy) {
      memoTranslateHy(en).then((tx) => { if (!cancelled && tx) setAuto(tx); });
    } else {
      setAuto(null);
    }
    return () => { cancelled = true; };
  }, [lang, en, savedHy]);
  if (lang === "hy") return savedHy || auto || en || "";
  return en || "";
}

/** Inline localized text. Returns admin HY override → machine HY → English. */
export default function HyText({ en, savedHy }: { en?: string | null; savedHy?: string | null }) {
  return <>{useHyAuto(en, savedHy)}</>;
}
