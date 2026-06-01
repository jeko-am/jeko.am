"use client";

import { useEffect, useState, ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n/LangProvider";

export interface LegalBlock {
  /** Heading text — rendered as a styled <h2>. */
  heading: string;
  /** Body text. Paragraphs separated by blank lines (\n\n). Optional. */
  body?: string;
  /** Custom JSX placed AFTER body — useful for tables, lists, callouts that
   *  the in-code fallback wants but a CMS-only block won't have. */
  extra?: ReactNode;
}

interface LegalStructuredRendererProps {
  slug: string;
  fallbackHero: {
    heading: string;
    headingHighlight?: string;
    subtitle: string;
    lastUpdated?: string;
    backgroundColor?: string;
  };
  fallbackBlocks: LegalBlock[];
}

type SectionContent = Record<string, unknown> & { hy?: Record<string, unknown> };

/**
 * Renders a long-form policy / legal page driven by Supabase `page_sections`.
 *
 * Architecture:
 *   - Section index 0 = Hero (heading, highlight, subtitle, last_updated, bg).
 *   - Section index 1..N = "Block N" rows with `heading` + `body`.
 *
 * Editing model:
 *   - Each block has plain text inputs in the store editor — no HTML required.
 *   - The body field is a textarea; blank lines mark paragraph breaks.
 *   - When CMS heading + body are both empty for a block, the in-code default
 *     fallback (extracted from the original JSX) renders instead.
 *
 * This is the cleanest editing model for non-technical admins: they see the
 * existing copy already broken into headings + paragraphs and just edit text.
 */
export default function LegalStructuredRenderer({
  slug,
  fallbackHero,
  fallbackBlocks,
}: LegalStructuredRendererProps) {
  const lang = useLang();
  const [sectionsByIdx, setSectionsByIdx] = useState<Map<number, SectionContent>>(new Map());
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

        const next = new Map<number, SectionContent>();
        const hidden = new Set<number>();
        sections.forEach((row: { content: SectionContent; is_visible: boolean | null }) => {
          const c = row.content || {};
          const rawIdx = c._section_index ?? c._homepage_index;
          const idx = rawIdx === undefined || rawIdx === null ? undefined : Number(rawIdx);
          if (typeof idx === "number" && Number.isFinite(idx)) {
            if (row.is_visible === false) hidden.add(idx);
            else next.set(idx, c);
          }
        });
        setSectionsByIdx(next);
        setHiddenByIdx(hidden);
      } catch {
        /* silent — fallback renders */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /**
   * Renders a body string as paragraphs, sub-headings, and lists.
   * Convention:
   *   - Blank line                → paragraph break
   *   - Line starting with "## "  → <h3> sub-heading
   *   - Lines starting with "- "  → grouped into a <ul>
   *   - Otherwise                 → <p>
   */
  function renderBody(body: string): ReactNode[] {
    const blocks = body.split(/\n{2,}/);
    const out: ReactNode[] = [];
    blocks.forEach((block, bi) => {
      const trimmed = block.trim();
      if (!trimmed) return;
      // Sub-heading
      if (trimmed.startsWith("## ")) {
        out.push(
          <h3 key={`h-${bi}`} className="text-deep-green font-rubik font-semibold text-lg mb-3 mt-6">
            {trimmed.slice(3).trim()}
          </h3>
        );
        return;
      }
      // List block — every line starts with "- "
      const lines = trimmed.split("\n");
      const allList = lines.length > 1 && lines.every((l) => l.trim().startsWith("- "));
      if (allList) {
        out.push(
          <ul key={`u-${bi}`} className="list-disc pl-6 mb-6 space-y-2">
            {lines.map((l, li) => (
              <li key={li} className="text-deep-green/80 text-[16px] leading-relaxed">
                {l.trim().slice(2)}
              </li>
            ))}
          </ul>
        );
        return;
      }
      // Plain paragraph
      out.push(
        <p key={`p-${bi}`} className="text-deep-green/80 text-[16px] leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
    return out;
  }

  function pick(content: SectionContent | undefined, key: string): string {
    if (!content) return "";
    if (lang === "hy" && content.hy && typeof content.hy === "object") {
      const hyVal = (content.hy as Record<string, unknown>)[key];
      if (typeof hyVal === "string" && hyVal.length > 0) return hyVal;
    }
    const v = content[key];
    return typeof v === "string" ? v : "";
  }

  const hero = sectionsByIdx.get(0);
  const heading = pick(hero, "heading") || fallbackHero.heading;
  const headingHighlight = pick(hero, "heading_highlight") || fallbackHero.headingHighlight || "";
  const subtitle = pick(hero, "subtitle") || fallbackHero.subtitle;
  const lastUpdated = pick(hero, "last_updated") || fallbackHero.lastUpdated || "";
  const heroBg = pick(hero, "background_color") || fallbackHero.backgroundColor || "#274C46";

  // For each block index 1..N (1-indexed in editor; 1-indexed in section_index too):
  //   prefer CMS heading + body, else fall through to in-code defaults.
  const renderedBlocks = fallbackBlocks.map((fb, i) => {
    const cmsContent = sectionsByIdx.get(i + 1);
    const cmsHeading = pick(cmsContent, "heading");
    const cmsBody = pick(cmsContent, "body");
    const heading = cmsHeading || fb.heading;
    const body = cmsBody || fb.body || "";
    return { heading, body, extra: fb.extra, key: `block-${i}`, index: i + 1 };
  });

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
        </section>}

        <section className="bg-off-white">
          <div className="max-w-[900px] mx-auto px-6 py-16">
            {lastUpdated ? (
              <p className="text-deep-green/60 text-sm font-rubik mb-10 italic">{lastUpdated}</p>
            ) : null}

            {renderedBlocks.filter((b) => !hiddenByIdx.has(b.index)).map((b) => (
              <div key={b.key} className="mb-12" data-section-index={b.index}>
                {b.heading ? (
                  <h2 className="text-deep-green font-rubik font-bold text-2xl mb-4">{b.heading}</h2>
                ) : null}
                {b.body ? renderBody(b.body) : null}
                {b.extra ? <div className="mt-2">{b.extra}</div> : null}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
