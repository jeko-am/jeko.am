"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n/LangProvider";

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
          .select("content")
          .eq("page_id", pageId);
        if (cancelled || !sections) return;

        sections.forEach((row: { content: SectionContent }) => {
          const c = row.content || {};
          const idx = (c._section_index as number | undefined) ?? (c._homepage_index as number | undefined);
          if (idx === 0) setHero(c);
          else if (idx === 1) setBody(c);
        });
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
    if (!content) return "";
    if (lang === "hy" && content.hy && typeof content.hy === "object") {
      const hyVal = (content.hy as Record<string, unknown>)[key];
      if (typeof hyVal === "string" && hyVal.length > 0) return hyVal;
    }
    const v = content[key];
    return typeof v === "string" ? v : "";
  }

  const heading = pick(hero, "heading") || fallbackHeading;
  const headingHighlight = pick(hero, "heading_highlight") || fallbackHeadingHighlight || "";
  const subtitle = pick(hero, "subtitle") || fallbackSubtitle;
  const heroBg = pick(hero, "background_color") || "#274C46";

  const lastUpdated = pick(body, "last_updated") || fallbackLastUpdated || "";
  const bodyHtml = pick(body, "body_html") || "";

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        <section
          className="py-16 text-center relative zigzag-bottom"
          style={{ backgroundColor: heroBg }}
          data-section-index={0}
        >
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {heading}
              {headingHighlight ? (
                <>
                  {" "}
                  <span className="text-gold">{headingHighlight}</span>
                </>
              ) : null}
            </h1>
            {subtitle ? (
              <p className="text-white/70 max-w-xl mx-auto text-lg">{subtitle}</p>
            ) : null}
          </div>
        </section>

        <section className="bg-off-white" data-section-index={1}>
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {lastUpdated ? (
              <p className="text-deep-green/60 text-sm font-rubik mb-10 italic">
                {lastUpdated}
              </p>
            ) : null}

            {bodyHtml ? (
              <div
                className="legal-prose text-deep-green/80"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              fallbackBody
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
