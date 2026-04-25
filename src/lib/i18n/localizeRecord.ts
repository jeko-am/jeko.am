import type { Lang } from "./types";

/**
 * Read a translated field off any DB record that has an `i18n` JSONB column.
 * Falls back to the base (English) column when the Armenian override is empty.
 *
 *   localize(product, "name", lang)
 *   // => product.i18n?.hy?.name (when lang=hy and set) || product.name
 */
export function localize<T extends Record<string, unknown>>(
  record: T | null | undefined,
  field: string,
  lang: Lang
): string {
  if (!record) return "";
  if (lang === "hy") {
    const i18n = (record as { i18n?: { hy?: Record<string, unknown> } }).i18n;
    const hy = i18n?.hy?.[field];
    if (typeof hy === "string" && hy.length > 0) return hy;
  }
  const base = (record as Record<string, unknown>)[field];
  return typeof base === "string" ? base : "";
}

/**
 * Writes a value into `i18n.{lang}.{field}` and returns the new i18n object
 * (immutable).
 */
export function setLocalized(
  i18n: Record<string, unknown> | null | undefined,
  lang: Lang,
  field: string,
  value: string
): Record<string, unknown> {
  const base = (i18n ?? {}) as Record<string, unknown>;
  const langBucket = { ...((base[lang] as Record<string, unknown>) ?? {}) };
  if (value && value.length > 0) langBucket[field] = value;
  else delete langBucket[field];
  return { ...base, [lang]: langBucket };
}
