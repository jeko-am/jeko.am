// Helper for storefront components to apply admin-editor font-size overrides.
// Sizes are stored per-field as: `${key}_font_size_desktop`, `${key}_font_size_mobile`.
// Legacy single value `${key}_font_size` is treated as desktop fallback.
//
// Usage:
//   const style = dynFontStyle(content, 'heading');
//   <h1 className="dyn-fs ..." style={style}>...</h1>
//
// The `dyn-fs` class is defined in globals.css and switches between
// --fs-mobile and --fs-desktop at the md breakpoint.

import type { CSSProperties } from "react";
import { fontFamilyFor, fontFamilyForLang } from "./font-options";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Content = Record<string, any> | null | undefined;

function toPx(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n}px`;
}

function toColor(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function colorFor(content: Content, fieldKey: string): string | null {
  if (!content) return null;
  const direct =
    toColor(content[`${fieldKey}_color`]) ??
    toColor(content[`${fieldKey}_text_color`]);
  if (direct) return direct;

  if (/price/i.test(fieldKey)) return toColor(content.price_text_color);
  if (/(button|cta|add_to_cart)/i.test(fieldKey)) return toColor(content.button_text_color);
  if (/(heading|title|name|year|stat|author)/i.test(fieldKey)) return toColor(content.heading_color);
  if (/(body|description|subheading|text|content|quote|label|subtitle)/i.test(fieldKey)) {
    return toColor(content.body_text_color);
  }
  return null;
}

export function dynFontStyle(content: Content, fieldKey: string, lang: string = "en"): CSSProperties | undefined {
  if (!content) return undefined;
  const desktop =
    toPx(content[`${fieldKey}_font_size_desktop`]) ??
    toPx(content[`${fieldKey}_font_size`]);
  const mobile = toPx(content[`${fieldKey}_font_size_mobile`]);
  const family = fontFamilyForLang(
    content[`${fieldKey}_font_family`],
    content[`${fieldKey}_font_family_hy`],
    lang
  );
  const color = colorFor(content, fieldKey);
  // Defensive: keep the standalone helper available for other callers.
  void fontFamilyFor;

  if (!desktop && !mobile && !family && !color) return undefined;
  // Both vars default to each other so partial config still works.
  const style: Record<string, string> = {};
  if (desktop) style["--fs-desktop"] = desktop;
  if (mobile) style["--fs-mobile"] = mobile;
  if (desktop && !mobile) style["--fs-mobile"] = desktop;
  if (mobile && !desktop) style["--fs-desktop"] = mobile;
  if (family) style.fontFamily = family;
  if (color) style.color = color;
  return style as CSSProperties;
}

/** Returns the `dyn-fs` class only when a font-size override exists for this
 *  field. Use this in `className` so the responsive font-size CSS rule does
 *  NOT activate (and clobber the existing inline/utility size) when the admin
 *  hasn't set anything. */
export function dynFontClass(content: Content, fieldKey: string): string {
  if (!content) return "";
  const hasDesktop =
    toPx(content[`${fieldKey}_font_size_desktop`]) !== null ||
    toPx(content[`${fieldKey}_font_size`]) !== null;
  const hasMobile = toPx(content[`${fieldKey}_font_size_mobile`]) !== null;
  return hasDesktop || hasMobile ? "dyn-fs" : "";
}

export function dynButtonStyle(content: Content, fieldKey: string, lang: string = "en"): CSSProperties | undefined {
  const style = { ...(dynFontStyle(content, fieldKey, lang) || {}) } as CSSProperties;
  if (content && typeof content.button_background_color === "string" && content.button_background_color.trim()) {
    style.backgroundColor = content.button_background_color;
    style.borderColor = content.button_background_color;
  }
  if (content && typeof content.button_text_color === "string" && content.button_text_color.trim()) {
    style.color = content.button_text_color;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}
