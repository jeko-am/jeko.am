"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/LangProvider";
import { fontFamilyForLang } from "@/lib/font-options";

type Content = Record<string, unknown>;

const TEXT_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "a",
  "button",
  "label",
  "li",
  "td",
  "th",
  "strong",
  "em",
  "input",
  "textarea",
].join(",");

function isStyleMetaKey(key: string): boolean {
  return (
    key.startsWith("_") ||
    key === "hy" ||
    key.endsWith("_url") ||
    key.endsWith("_href") ||
    key.endsWith("_image") ||
    key.endsWith("_icon") ||
    key.endsWith("_video") ||
    key.endsWith("_color") ||
    key.endsWith("_font_family") ||
    key.endsWith("_font_family_hy") ||
    key.endsWith("_font_size") ||
    key.endsWith("_font_size_desktop") ||
    key.endsWith("_font_size_mobile") ||
    key.endsWith("_visible")
  );
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toPx(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? `${n}px` : null;
}

function fontSizeFor(content: Content, key: string): string | null {
  const mobile = toPx(content[`${key}_font_size_mobile`]);
  const desktop = toPx(content[`${key}_font_size_desktop`]) ?? toPx(content[`${key}_font_size`]);
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
    return mobile ?? desktop;
  }
  return desktop ?? mobile;
}

function colorFor(content: Content, key: string): string | null {
  const direct = content[`${key}_color`] ?? content[`${key}_text_color`];
  if (typeof direct === "string" && direct.trim()) return direct;
  if (/price/i.test(key) && typeof content.price_text_color === "string") return content.price_text_color;
  if (/(button|cta|add_to_cart)/i.test(key) && typeof content.button_text_color === "string") return content.button_text_color;
  if (/(heading|title|name|year|stat)/i.test(key) && typeof content.heading_color === "string") return content.heading_color;
  if (/(body|description|subheading|text|content|quote|label)/i.test(key) && typeof content.body_text_color === "string") return content.body_text_color;
  return null;
}

function applyTextStyle(element: Element, content: Content, key: string, lang: string) {
  const html = element as HTMLElement;
  const family = fontFamilyForLang(content[`${key}_font_family`], content[`${key}_font_family_hy`], lang);
  const size = fontSizeFor(content, key);
  const color = colorFor(content, key);
  const applyOne = (target: HTMLElement) => {
    if (family) target.style.setProperty("font-family", family, "important");
    const hasComponentFontSizeVars =
      Boolean(target.style.getPropertyValue("--fs-desktop")) ||
      Boolean(target.style.getPropertyValue("--fs-mobile"));
    if (size && !hasComponentFontSizeVars) target.style.setProperty("font-size", size, "important");
    if (color) target.style.setProperty("color", color, "important");
  };
  applyOne(html);
  html.querySelectorAll(TEXT_SELECTOR).forEach((child) => applyOne(child as HTMLElement));
}

function applySectionStyles(root: Element, content: Content, lang: string) {
  const hy = lang === "hy" && content.hy && typeof content.hy === "object"
    ? (content.hy as Content)
    : null;
  const entries = Object.entries(content)
    .filter(([key, value]) => !isStyleMetaKey(key) && typeof value === "string" && stripHtml(value).length > 0)
    .map(([key, value]) => {
      const localized = hy && typeof hy[key] === "string" && stripHtml(hy[key]).length > 0 ? String(hy[key]) : String(value);
      return { key, text: stripHtml(localized) };
    })
    .filter(({ text }) => text.length > 0);

  if (entries.length === 0) return;

  const candidates = Array.from(root.querySelectorAll(TEXT_SELECTOR));
  for (const { key, text } of entries) {
    const shortText = text.length > 160 ? text.slice(0, 160) : text;
    const matches: Element[] = [];
    for (const element of candidates) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const placeholder = element.getAttribute("placeholder") || "";
        const value = element.value || "";
        if (placeholder.includes(shortText) || value.includes(shortText)) matches.push(element);
        continue;
      }
      const elementText = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (!elementText) continue;
      if (elementText === text || elementText.includes(shortText) || text.includes(elementText)) {
        matches.push(element);
      }
    }

    const mostSpecific = matches.filter((element) => {
      return !matches.some((other) => other !== element && element.contains(other));
    });
    for (const element of mostSpecific) {
      applyTextStyle(element, content, key, lang);
    }
  }
}

export default function StoreEditorStyleBridge() {
  const pathname = usePathname();
  const { lang } = useT();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    let cancelled = false;

    async function loadAndApply() {
      const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
      const withoutSlash = withSlash.slice(1);
      const filters = withSlash === "/"
        ? ["slug.eq.home", "slug.eq.homepage", "slug.eq./", "slug.eq."]
        : [`slug.eq.${withSlash}`, `slug.eq.${withoutSlash}`];
      if (withSlash.startsWith("/products/")) {
        const productSlug = withSlash.split("/").filter(Boolean).at(-1);
        if (productSlug) filters.push(`slug.eq.product-${productSlug}`);
      }

      const { data: pages } = await supabase
        .from("pages")
        .select("id")
        .or(filters.join(","))
        .limit(1);
      const pageId = pages?.[0]?.id;
      if (!pageId || cancelled) return;

      const { data: sections } = await supabase
        .from("page_sections")
        .select("content, sort_order")
        .eq("page_id", pageId);
      if (!sections || cancelled) return;

      for (const section of sections) {
        const content = (section.content || {}) as Content;
        const idx = Number(content._section_index ?? content._homepage_index ?? section.sort_order);
        if (!Number.isFinite(idx)) continue;
        document
          .querySelectorAll(`[data-section-index="${idx}"]`)
          .forEach((root) => applySectionStyles(root, content, lang));
      }
    }

    const run = () => {
      loadAndApply();
      window.setTimeout(loadAndApply, 400);
      window.setTimeout(loadAndApply, 1200);
      window.setTimeout(loadAndApply, 2500);
      window.setTimeout(loadAndApply, 5000);
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, lang]);

  return null;
}
