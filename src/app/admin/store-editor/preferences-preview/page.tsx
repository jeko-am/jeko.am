"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FALLBACKS = [
  { name: "Temperament Options", options: ["Friendly", "Energetic", "Calm", "Playful", "Protective", "Shy"] },
  { name: "Activity Levels", options: ["Low", "Moderate", "High", "Very High"] },
  { name: "Gender Options", options: ["Male", "Female", "Unknown"] },
  { name: "Walk Preferences", options: ["Short walks", "Long hikes", "Off-lead runs", "City strolls"] },
  { name: "Favourite Activities", options: ["Fetch", "Swimming", "Agility", "Socialising", "Tug of war", "Frisbee"] },
];

type PreviewSection = {
  name: string;
  options: string[];
  hidden: boolean;
};

export default function MatchingPreferencesPreviewPage() {
  const [sections, setSections] = useState<PreviewSection[]>(
    FALLBACKS.map((section) => ({ ...section, hidden: false }))
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: pages } = await supabase
        .from("pages")
        .select("id")
        .or("slug.eq.preferences-config,slug.eq./preferences-config")
        .limit(1);
      const pageId = pages?.[0]?.id;
      if (!pageId) return;

      const { data: rows } = await supabase
        .from("page_sections")
        .select("section_type, content, is_visible, sort_order")
        .eq("page_id", pageId)
        .order("sort_order", { ascending: true });
      if (cancelled || !rows) return;

      setSections(FALLBACKS.map((fallback, index) => {
        const row = rows.find((item) => {
          const content = (item.content || {}) as Record<string, unknown>;
          return item.section_type === fallback.name || Number(content._section_index ?? item.sort_order) === index;
        });
        const content = (row?.content || {}) as Record<string, unknown>;
        const options = Array.isArray(content.options) ? content.options.map(String) : fallback.options;
        return {
          name: row?.section_type || fallback.name,
          options,
          hidden: row?.is_visible === false,
        };
      }));
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-off-white p-8 font-rubik">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-deep-green mb-2">Matching Preferences</h1>
        <p className="text-deep-green/60 mb-8">Preview of configurable matching preference option groups.</p>
        <div className="space-y-5">
          {sections.map((section, index) => (
            <section
              key={section.name}
              data-section-index={index}
              className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm ${section.hidden ? "hidden" : ""}`}
            >
              <h2 className="font-semibold text-deep-green mb-3">{section.name}</h2>
              <div className="flex flex-wrap gap-2">
                {section.options.map((option) => (
                  <span key={option} className="rounded-full bg-deep-green/10 px-3 py-1 text-sm text-deep-green">
                    {option}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
