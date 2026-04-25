"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { applyOverrides } from "./LangProvider";

/**
 * Loads translation overrides from the `translations` table and merges them
 * on top of the static dictionary. Safely no-ops if the table doesn't exist
 * yet — the static dictionary still works.
 */
export default function TranslationsBootstrap() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("translations")
          .select("key, en, hy");
        if (cancelled) return;
        if (error || !data) return;
        const en: Record<string, string> = {};
        const hy: Record<string, string> = {};
        for (const row of data as Array<{ key: string; en: string | null; hy: string | null }>) {
          if (row.en) en[row.key] = row.en;
          if (row.hy) hy[row.key] = row.hy;
        }
        applyOverrides("en", en);
        applyOverrides("hy", hy);
      } catch {
        // Table absent — ignore. Static dict is still serving.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
