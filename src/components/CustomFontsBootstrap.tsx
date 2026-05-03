"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setCustomFonts, type CustomFontRow } from "@/lib/font-options";

const STYLE_TAG_ID = "custom-fonts-injected";

/**
 * Loads admin-uploaded fonts from Supabase on mount, injects @font-face
 * declarations into <head>, and pushes them into the font-options registry
 * so they appear in the store-editor dropdown.
 *
 * If the custom_fonts table doesn't exist yet (migration not applied),
 * the request fails silently and only built-in fonts remain available.
 */
export default function CustomFontsBootstrap() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("custom_fonts")
        .select("*")
        .order("created_at", { ascending: true });

      if (cancelled || error || !data) return;

      const rows = data as CustomFontRow[];

      // Inject @font-face rules.
      let style = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = STYLE_TAG_ID;
        document.head.appendChild(style);
      }
      style.textContent = rows.map(toFontFaceRule).join("\n");

      setCustomFonts(rows);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

function toFontFaceRule(row: CustomFontRow): string {
  const formatHint = row.format ? ` format('${row.format}')` : "";
  return `@font-face {
  font-family: '${row.family}';
  src: url('${row.file_url}')${formatHint};
  font-weight: ${row.font_weight};
  font-style: ${row.font_style};
  font-display: swap;
}`;
}
