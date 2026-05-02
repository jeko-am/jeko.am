// Font options surfaced in the admin store editor and applied at render time.
// `value` is what gets persisted. `family` is the CSS font-family stack.
// Keep in sync with @font-face declarations and the @import in globals.css.

export interface FontOption {
  value: string;
  label: string;
  family: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { value: "default",            label: "Default (inherit)",   family: "" },
  { value: "fredoka",            label: "Fredoka",             family: "'Fredoka', 'Rubik', Helvetica, Arial, sans-serif" },
  { value: "rubik",              label: "Rubik",               family: "'Rubik', Helvetica, Arial, sans-serif" },
  { value: "frankfurter",        label: "Frankfurter",         family: "'Frankfurter', 'Rubik', Arial, sans-serif" },
  { value: "frankfurter-hl",     label: "Frankfurter Highlight", family: "'Frankfurter Highlight', 'Frankfurter', Arial, sans-serif" },
  { value: "tr-frankfurter",     label: "TR Frankfurter",      family: "'TR Frankfurter', 'Frankfurter', Arial, sans-serif" },
  { value: "vag-rounded",        label: "VAG Rounded Next",    family: "'VAG Rounded Next', 'Fredoka', 'Rubik', Helvetica, Arial, sans-serif" },
  { value: "caveat",             label: "Caveat",              family: "'Caveat', cursive" },
  { value: "sofia",              label: "Sofia Pro",           family: "'Sofia Pro', 'Fredoka', 'Rubik', Arial, sans-serif" },
  { value: "helvetica",          label: "Helvetica",           family: "Helvetica, Arial, sans-serif" },
  { value: "arial",              label: "Arial",               family: "Arial, Helvetica, sans-serif" },
  { value: "system",             label: "System UI",           family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
];

export function fontFamilyFor(value: unknown): string | null {
  if (typeof value !== "string" || !value || value === "default") return null;
  const found = FONT_OPTIONS.find(f => f.value === value);
  return found?.family || null;
}
