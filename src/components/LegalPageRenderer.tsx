"use client";

import { ReactNode, useEffect, useState, type CSSProperties } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n/LangProvider";
import { dynFontClass, dynFontStyle } from "@/lib/dynamic-font-size";
import { localizedContentText } from "@/lib/content-field";

interface LegalPageRendererProps {
  slug: string;
  fallbackHeading: string;
  fallbackHeadingHighlight?: string;
  fallbackSubtitle: string;
  fallbackLastUpdated?: string;
  /** Rendered when no body_html override has been saved in the editor. */
  fallbackBody: ReactNode;
}

type SectionContent = Record<string, unknown> & { hy?: Record<string, unknown> };

/**
 * Renders any policy / legal / info page driven by Supabase `page_sections`.
 * Section index 0 = Hero, index 1 = Body Content (matches LEGAL_PAGE_SECTIONS).
 *
 * Behaviour:
 *   • Fetches page_sections for the given slug on mount.
 *   • Field-level: each value is `(localized cms value) || fallback`.
 *   • If body_html is empty, renders the fallback JSX so nothing breaks before
 *     the admin pastes HTML into the editor.
 */
export default function LegalPageRenderer({
  slug,
  fallbackHeading,
  fallbackHeadingHighlight,
  fallbackSubtitle,
  fallbackLastUpdated,
  fallbackBody,
}: LegalPageRendererProps) {
  const lang = useLang();
  const [hero, setHero] = useState<SectionContent | null>(null);
  const [body, setBody] = useState<SectionContent | null>(null);
  const [hiddenByIdx, setHiddenByIdx] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const withSlash = slug.startsWith("/") ? slug : `/${slug}`;
        const withoutSlash = slug.startsWith("/") ? slug.slice(1) : slug;
        const { data: pages } = await supabase
          .from("pages")
          .select("id")
          .or(`slug.eq.${withSlash},slug.eq.${withoutSlash}`)
          .limit(1);
        const pageId = pages?.[0]?.id;
        if (!pageId) return;

        const { data: sections } = await supabase
          .from("page_sections")
          .select("content, is_visible")
          .eq("page_id", pageId);
        if (cancelled || !sections) return;

        const hidden = new Set<number>();
        sections.forEach((row: { content: SectionContent; is_visible: boolean | null }) => {
          const c = row.content || {};
          const rawIdx = c._section_index ?? c._homepage_index;
          const idx = rawIdx === undefined || rawIdx === null ? undefined : Number(rawIdx);
          if (typeof idx === "number" && Number.isFinite(idx) && row.is_visible === false) {
            hidden.add(idx);
            return;
          }
          if (idx === 0) setHero(c);
          else if (idx === 1) setBody(c);
        });
        setHiddenByIdx(hidden);
      } catch {
        /* fall back silently — fallback JSX still renders */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /** Pick localised value: prefer hy override when on /hy locale, else EN. */
  function pick(content: SectionContent | null, key: string): string {
    return localizedContentText(content, key, lang, "");
  }

  function textStyle(content: SectionContent | null, key: string, colorKey: string): CSSProperties | undefined {
    return {
      ...(dynFontStyle(content, key, lang) || {}),
      ...(pick(content, colorKey) ? { color: pick(content, colorKey) } : {}),
    };
  }

  const heading = localizedContentText(hero, "heading", lang, fallbackHeading);
  const headingHighlight = localizedContentText(hero, "heading_highlight", lang, fallbackHeadingHighlight || "");
  const subtitle = localizedContentText(hero, "subtitle", lang, fallbackSubtitle);
  const heroBg = pick(hero, "background_color") || "#274C46";

  const lastUpdated = localizedContentText(body, "last_updated", lang, fallbackLastUpdated || "");
  const bodyHtml = localizedContentText(body, "body_html", lang, "");
  const bodyBg = pick(body, "background_color") || "";

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {!hiddenByIdx.has(0) && <section
          className="py-16 text-center relative zigzag-bottom"
          style={{ backgroundColor: heroBg }}
          data-section-index={0}
        >
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${dynFontClass(hero, "heading")}`} style={textStyle(hero, "heading", "heading_color")}>
              {heading}
              {headingHighlight ? (
                <>
                  {" "}
                  <span className={`text-gold ${dynFontClass(hero, "heading_highlight")}`} style={textStyle(hero, "heading_highlight", "heading_highlight_color")}>{headingHighlight}</span>
                </>
              ) : null}
            </h1>
            {subtitle ? (
              <p className={`text-white/70 max-w-xl mx-auto text-lg ${dynFontClass(hero, "subtitle")}`} style={textStyle(hero, "subtitle", "subtitle_color")}>{subtitle}</p>
            ) : null}
          </div>
        </section>}

        {!hiddenByIdx.has(1) && <section className="bg-off-white" data-section-index={1} style={{ backgroundColor: bodyBg || undefined }}>
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {lastUpdated ? (
              <p className={`text-deep-green/60 text-sm font-rubik mb-10 italic ${dynFontClass(body, "last_updated")}`} style={textStyle(body, "last_updated", "last_updated_color")}>
                {lastUpdated}
              </p>
            ) : null}

            {bodyHtml ? (
              <div
                className={`legal-prose text-deep-green/80 ${dynFontClass(body, "body_html")}`}
                style={textStyle(body, "body_html", "body_text_color")}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              fallbackBody
            )}
          </div>
        </section>}
      </main>
      <Footer />
    </>
  );
}
