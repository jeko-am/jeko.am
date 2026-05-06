"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n/LangProvider";
import { supabase } from "@/lib/supabase";

interface Article {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  url: string;
}

const fallbackArticles: Article[] = [
  { title: "5 Signs Your Dog Needs a Diet Change", excerpt: "From itchy skin to low energy, learn the telltale signs that your dog's current food might not be meeting their needs.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop", category: "Nutrition", url: "#" },
  { title: "The Benefits of Air-Dried Dog Food", excerpt: "Discover why air-drying is one of the gentlest ways to prepare dog food while locking in maximum nutrition.", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop", category: "Food Science", url: "#" },
  { title: "How Much Should I Feed My Dog?", excerpt: "A complete guide to portion sizes based on your dog's breed, age, weight, and activity level.", image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=600&h=400&fit=crop", category: "Feeding Guide", url: "#" },
  { title: "Understanding Dog Food Labels", excerpt: "What do all those ingredients really mean? We break down dog food labels so you can make informed choices.", image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=400&fit=crop", category: "Education", url: "#" },
  { title: "Seasonal Care Tips for Your Dog", excerpt: "From summer heatwaves to winter walks, how to keep your dog happy and healthy all year round.", image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop", category: "Wellbeing", url: "#" },
  { title: "Transitioning Your Dog to Jeko", excerpt: "Our step-by-step guide to switching your dog's food gradually for a smooth and stress-free transition.", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop", category: "Getting Started", url: "#" },
];

export default function BeyondTheBowlPage() {
  const { t } = useT();
  const [hero, setHero] = useState<Record<string, string>>({});
  const [grid, setGrid] = useState<Record<string, string>>({});
  const [cta, setCta] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: pages } = await supabase
          .from("pages")
          .select("id")
          .or("slug.eq./beyond-the-bowl,slug.eq.beyond-the-bowl")
          .limit(1);
        const pageId = pages?.[0]?.id;
        if (!pageId) return;
        const { data } = await supabase
          .from("page_sections")
          .select("content")
          .eq("page_id", pageId);
        if (cancelled || !data) return;
        data.forEach((row: { content: Record<string, unknown> }) => {
          const idx = row.content?._section_index as number | undefined;
          if (idx === 0) setHero(row.content as Record<string, string>);
          else if (idx === 1) setGrid(row.content as Record<string, string>);
          else if (idx === 2) setCta(row.content as Record<string, string>);
        });
      } catch {
        /* fallback to hardcoded */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const cmsArticles = ([1, 2, 3, 4, 5, 6] as const)
    .map((n) => ({
      title: String(grid[`a${n}_title`] || ""),
      excerpt: String(grid[`a${n}_excerpt`] || ""),
      image: String(grid[`a${n}_image`] || ""),
      category: String(grid[`a${n}_category`] || ""),
      url: String(grid[`a${n}_url`] || "#"),
    }))
    .filter((a) => a.title);
  const articles = cmsArticles.length > 0 ? cmsArticles : fallbackArticles;

  const heading = hero.heading || t("beyond.page.heading");
  const headingHighlight = hero.heading_highlight || t("beyond.page.headingHighlight");
  const subheading = hero.subtitle || t("beyond.page.subheading");
  const ctaHeading = cta.heading || t("beyond.newsletter.heading");
  const ctaBody = cta.body || t("beyond.newsletter.body");
  const ctaText = cta.cta_text || t("beyond.newsletter.cta");
  const ctaUrl = cta.cta_url || "/products";

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom" data-section-index={0}>
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-4">
              {heading} <span className="text-gold">{headingHighlight}</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">{subheading}</p>
          </div>
        </section>

        <section className="bg-off-white" data-section-index={1}>
          <div className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <Link
                  key={`${article.title}-${i}`}
                  href={article.url || "#"}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
                >
                  <div className="relative h-[200px]">
                    {article.image ? (
                      <Image src={article.image} alt={article.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-deep-green/10" />
                    )}
                    {article.category ? (
                      <span className="absolute top-3 left-3 bg-deep-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <h3 className="text-deep-green font-rubik font-bold text-lg mb-2">{article.title}</h3>
                    <p className="text-deep-green/70 text-[15px] leading-relaxed mb-4">{article.excerpt}</p>
                    <span className="text-deep-green font-semibold text-sm hover:underline">
                      {t("beyond.readMore")} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 bg-deep-green rounded-2xl p-10 text-center" data-section-index={2}>
              <h2 className="text-white font-rubik font-bold text-2xl mb-3">{ctaHeading}</h2>
              <p className="text-white/80 max-w-lg mx-auto mb-6">{ctaBody}</p>
              <Link href={ctaUrl} className="inline-block bg-gold text-deep-green font-semibold px-8 py-3 rounded-full hover:bg-gold/90 transition-colors">
                {ctaText}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
