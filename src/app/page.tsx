import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import OfferBanner from "@/components/OfferBanner";
import WhatIsPure from "@/components/WhatIsPure";
import BenefitsBar from "@/components/BenefitsBar";
import ProductHighlights from "@/components/ProductHighlights";
import TrendingProducts from "@/components/TrendingProducts";
import VideoTestimonials from "@/components/VideoTestimonials";
import HowPlanWorks from "@/components/HowPlanWorks";
import StatsSection from "@/components/StatsSection";
import ComparisonTable from "@/components/ComparisonTable";
import YorkshireVet from "@/components/YorkshireVet";
import DragonsDen from "@/components/DragonsDen";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import EditorOverlay from "@/components/EditorOverlay";
import MatchingModal from "@/components/MatchingModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionContent = Record<string, any>;

/** Replace "Pure" with "Jeko" in all user-visible string values from DB content */
function sanitizeBrand(content: SectionContent): SectionContent {
  const out: SectionContent = {};
  for (const [k, v] of Object.entries(content)) {
    if (typeof v === "string" && !k.endsWith("_url") && !k.endsWith("_image") && k !== "image") {
      out[k] = v.replace(/\bPure\b/g, "Jeko").replace(/\bPURE\b/g, "JEKO");
    } else {
      out[k] = v;
    }
  }
  return out;
}

async function getSectionContents(): Promise<{ content: Map<number, SectionContent>; hidden: Set<number> }> {
  noStore();
  const content = new Map<number, SectionContent>();
  const hidden = new Set<number>();
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: pages } = await supabase
      .from("pages")
      .select("id")
      .or("slug.eq.home,slug.eq.homepage,slug.eq./,slug.eq.")
      .limit(1);
    let pageId = pages?.[0]?.id;
    if (!pageId) {
      const { data: firstPage } = await supabase
        .from("pages")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);
      pageId = firstPage?.[0]?.id;
    }
    if (!pageId) return { content, hidden };

    const { data: sections } = await supabase
      .from("page_sections")
      .select("content, is_visible")
      .eq("page_id", pageId);
    sections?.forEach((s: { content: SectionContent | null; is_visible: boolean | null }) => {
      const idx = s.content?._homepage_index;
      if (idx === undefined || idx === null) return;
      const n = Number(idx);
      content.set(n, sanitizeBrand(s.content || {}));
      if (s.is_visible === false) hidden.add(n);
    });
  } catch {
    // Fallback to hardcoded defaults on error
  }
  return { content, hidden };
}

export default async function Home() {
  const { content: sectionData, hidden } = await getSectionContents();
  const show = (n: number) => !hidden.has(n);

  return (
    <>
      {show(15) && (
        <div data-section-index="15" data-section-name="Popup Modal">
          <MatchingModal content={sectionData.get(15)} />
        </div>
      )}
      <EditorOverlay />
      {show(0) && (
        <div data-section-index="0" data-section-name="Header">
          <Header content={sectionData.get(0)} />
        </div>
      )}
      <main className="pt-[64px] lg:pt-[80px]">
        {show(1) && (
          <div data-section-index="1" data-section-name="Hero Section">
            <HeroSection content={sectionData.get(1)} />
          </div>
        )}
        {show(2) && (
          <div data-section-index="2" data-section-name="Offer Banner">
            <OfferBanner content={sectionData.get(2)} />
          </div>
        )}
        {show(3) && (
          <div data-section-index="3" data-section-name="What is Jeko">
            <WhatIsPure content={sectionData.get(3)} />
          </div>
        )}
        {show(4) && (
          <div data-section-index="4" data-section-name="Benefits Bar">
            <BenefitsBar content={sectionData.get(4)} />
          </div>
        )}
        {show(5) && (
          <div data-section-index="5" data-section-name="Product Highlights">
            <ProductHighlights content={sectionData.get(5)} />
          </div>
        )}
        {show(6) && (
          <div data-section-index="6" data-section-name="Trending Products">
            <TrendingProducts content={sectionData.get(6)} />
          </div>
        )}
        {show(7) && (
          <div data-section-index="7" data-section-name="Video Testimonials">
            <VideoTestimonials content={sectionData.get(7)} />
          </div>
        )}
        {show(8) && (
          <div data-section-index="8" data-section-name="How It Works">
            <HowPlanWorks content={sectionData.get(8)} />
          </div>
        )}
        {show(9) && (
          <div data-section-index="9" data-section-name="Stats">
            <StatsSection content={sectionData.get(9)} />
          </div>
        )}
        {show(10) && (
          <div data-section-index="10" data-section-name="Comparison Table">
            <ComparisonTable content={sectionData.get(10)} />
          </div>
        )}
        {show(11) && (
          <div data-section-index="11" data-section-name="Yorkshire Vet">
            <YorkshireVet content={sectionData.get(11)} />
          </div>
        )}
        {show(12) && (
          <div data-section-index="12" data-section-name="Dragons Den">
            <DragonsDen content={sectionData.get(12)} />
          </div>
        )}
        {show(13) && (
          <div data-section-index="13" data-section-name="FAQ">
            <FAQSection content={sectionData.get(13)} />
          </div>
        )}
      </main>
      {show(14) && (
        <div data-section-index="14" data-section-name="Footer">
          <Footer content={sectionData.get(14)} />
        </div>
      )}
    </>
  );
}
