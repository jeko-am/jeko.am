"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LangProvider";
import { translateOne, cache, registry } from "@/lib/i18n/hyCache";

export { prewarm as prewarmTranslations } from "@/lib/i18n/hyCache";

// Kept for backward compat — components that import memoTranslateHy directly still work.
export async function memoTranslateHy(text: string): Promise<string | null> {
  return translateOne(text);
}

export function useHyAuto(en: string | null | undefined, savedHy?: string | null): string {
  const { lang } = useT();

  // Check cache synchronously so already-warmed strings render instantly
  const cached = en && lang === "hy" && !savedHy ? cache.get(en) ?? null : null;
  const [auto, setAuto] = useState<string | null>(cached);

  // Register for future pre-warming
  useEffect(() => { if (en) registry.add(en); }, [en]);

  useEffect(() => {
    let cancelled = false;
    if (lang === "hy" && en && !savedHy) {
      // If already in cache, apply synchronously (no flash)
      const hit = cache.get(en);
      if (hit) { setAuto(hit); return; }
      translateOne(en).then(tx => { if (!cancelled && tx) setAuto(tx); });
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
