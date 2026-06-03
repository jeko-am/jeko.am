// Font options surfaced in the admin store editor and applied at render time.
// `value` is what gets persisted. `family` is the CSS font-family stack.
// Keep in sync with @font-face declarations and the @import in globals.css.
//
// `supportsLatin` / `supportsArmenian` flag which language the font's glyph
// coverage handles. Branded Latin-only fonts (Fredoka, Frankfurter, etc.)
// silently fall back to the OS for Armenian — see FONTS_README.md.

import { useSyncExternalStore } from "react";

export interface FontOption {
  value: string;
  label: string;
  family: string;
  supportsLatin: boolean;
  supportsArmenian: boolean;
}

export interface CustomFontRow {
  id: string;
  label: string;
  value: string;
  family: string;
  file_url: string;
  supports_latin: boolean;
  supports_armenian: boolean;
  font_weight: string;
  font_style: string;
  format: string | null;
  created_at: string;
}

const BUILT_IN_FONTS: FontOption[] = [
  { value: "default",         label: "Default (inherit)",     family: "",                                                                          supportsLatin: true,  supportsArmenian: true  },
  { value: "fredoka",         label: "Fredoka",               family: "'Fredoka', 'Rubik', Helvetica, Arial, sans-serif",                          supportsLatin: true,  supportsArmenian: false },
  { value: "rubik",           label: "Rubik",                 family: "'Rubik', Helvetica, Arial, sans-serif",                                     supportsLatin: true,  supportsArmenian: false },
  { value: "frankfurter",     label: "Frankfurter",           family: "'Frankfurter', 'Rubik', Arial, sans-serif",                                 supportsLatin: true,  supportsArmenian: false },
  { value: "frankfurter-hl",  label: "Frankfurter Highlight", family: "'Frankfurter Highlight', 'Frankfurter', Arial, sans-serif",                 supportsLatin: true,  supportsArmenian: false },
  { value: "tr-frankfurter",  label: "TR Frankfurter",        family: "'TR Frankfurter', 'Frankfurter', Arial, sans-serif",                        supportsLatin: true,  supportsArmenian: false },
  { value: "vag-rounded",     label: "VAG Rounded Next",      family: "'VAG Rounded Next', 'Fredoka', 'Rubik', Helvetica, Arial, sans-serif",      supportsLatin: true,  supportsArmenian: false },
  { value: "jeko",            label: "JEKO",                  family: "'JEKO', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", supportsLatin: true,  supportsArmenian: true  },
  { value: "caveat",          label: "Caveat",                family: "'Caveat', cursive",                                                         supportsLatin: true,  supportsArmenian: false },
  { value: "sofia",           label: "Sofia Pro",             family: "'Sofia Pro', 'Fredoka', 'Rubik', Arial, sans-serif",                        supportsLatin: true,  supportsArmenian: false },
  { value: "helvetica",       label: "Helvetica",             family: "Helvetica, Arial, sans-serif",                                              supportsLatin: true,  supportsArmenian: true  },
  { value: "arial",           label: "Arial",                 family: "Arial, Helvetica, sans-serif",                                              supportsLatin: true,  supportsArmenian: true  },
  { value: "system",          label: "System UI",             family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",      supportsLatin: true,  supportsArmenian: true  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Runtime registry for custom-uploaded fonts.
   CustomFontsBootstrap pushes rows in once Supabase has returned them.
   useFontOptions() subscribers re-render when the registry changes.
   ───────────────────────────────────────────────────────────────────────── */

let customFonts: FontOption[] = [];
const subscribers = new Set<() => void>();
let snapshot: FontOption[] = BUILT_IN_FONTS;

function rebuildSnapshot() {
  const seen = new Set<string>();
  snapshot = [...BUILT_IN_FONTS, ...customFonts].filter((font) => {
    if (seen.has(font.value)) return false;
    seen.add(font.value);
    return true;
  });
}

export function setCustomFonts(rows: CustomFontRow[]): void {
  const builtInValues = new Set(BUILT_IN_FONTS.map((font) => font.value));
  customFonts = rows
    .map(rowToOption)
    .filter((font) => !builtInValues.has(font.value));
  rebuildSnapshot();
  subscribers.forEach((cb) => cb());
}

function rowToOption(row: CustomFontRow): FontOption {
  return {
    value: row.value,
    label: row.label,
    family: `'${row.family}', Helvetica, Arial, sans-serif`,
    supportsLatin: row.supports_latin,
    supportsArmenian: row.supports_armenian,
  };
}

function subscribe(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

function getSnapshot(): FontOption[] {
  return snapshot;
}

function getServerSnapshot(): FontOption[] {
  return BUILT_IN_FONTS;
}

export function useFontOptions(): FontOption[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getAllFontOptions(): FontOption[] {
  return snapshot;
}

// Backwards-compat: existing imports still get the static built-ins.
// Use useFontOptions() for components that need to react to uploaded fonts.
export const FONT_OPTIONS = BUILT_IN_FONTS;

/* ─────────────────────────────────────────────────────────────────────────────
   Resolvers
   ───────────────────────────────────────────────────────────────────────── */

export function fontFamilyFor(value: unknown): string | null {
  if (typeof value !== "string" || !value || value === "default") return null;
  if (value.toLowerCase() === "jeko" || value.toLowerCase() === "jeko-regular") {
    return "'JEKO', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }
  const found = snapshot.find((f) => f.value === value);
  return found?.family || null;
}

/**
 * Pick the right CSS font-family stack for a given language.
 * - For HY: prefer the HY-specific override; if that's missing, fall back
 *   to the EN value. Browser will OS-fallback for Armenian glyphs missing
 *   in a Latin-only font.
 * - For EN: resolve the EN value directly.
 */
export function fontFamilyForLang(
  enValue: unknown,
  hyValue: unknown,
  lang: string
): string | null {
  if (lang === "hy") {
    const hy = fontFamilyFor(hyValue);
    if (hy) return hy;
    return fontFamilyFor(enValue);
  }
  return fontFamilyFor(enValue);
}
