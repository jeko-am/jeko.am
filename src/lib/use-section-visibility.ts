"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useSectionVisibility(pageSlug: string): string {
  const [css, setCss] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const withSlash = pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;
        const withoutSlash = pageSlug.startsWith("/") ? pageSlug.slice(1) : pageSlug;
        const { data: pages } = await supabase
          .from("pages")
          .select("id")
          .or(`slug.eq.${withSlash},slug.eq.${withoutSlash}`)
          .limit(1);
        const pageId = pages?.[0]?.id;
        if (!pageId) return;

        const { data: sections } = await supabase
          .from("page_sections")
          .select("content, is_visible, sort_order")
          .eq("page_id", pageId);
        if (cancelled || !sections) return;

        const nextCss = sections
          .filter((section) => section.is_visible === false)
          .map((section) => {
            const content = (section.content || {}) as Record<string, unknown>;
            const index = Number(content._section_index ?? content._homepage_index ?? section.sort_order);
            return Number.isFinite(index) ? `[data-section-index="${index}"]{display:none!important;}` : "";
          })
          .filter(Boolean)
          .join("\n");
        setCss(nextCss);
      } catch {
        if (!cancelled) setCss("");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [pageSlug]);

  return css;
}
