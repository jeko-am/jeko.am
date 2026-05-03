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
  // Defensive: keep the standalone helper available for other callers.
  void fontFamilyFor;

  if (!desktop && !mobile && !family) return undefined;
  // Both vars default to each other so partial config still works.
  const style: Record<string, string> = {};
  if (desktop) style["--fs-desktop"] = desktop;
  if (mobile) style["--fs-mobile"] = mobile;
  if (desktop && !mobile) style["--fs-mobile"] = desktop;
  if (mobile && !desktop) style["--fs-desktop"] = mobile;
  if (family) style.fontFamily = family;
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
