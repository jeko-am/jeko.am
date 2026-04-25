"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useT } from "@/lib/i18n/LangProvider";
import HyText from "@/components/HyText";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Symptom {
  icon: string;
  title: string;
  description: string;
}

interface FoodBenefit {
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface HealthConditionProps {
  condition: string;
  tagline: string;
  heroImage: string;
  heroDescription: string;
  whatIsTitle: string;
  whatIsText: string[];
  symptoms: Symptom[];
  howDietHelpsTitle: string;
  howDietHelpsText: string;
  foodBenefits: FoodBenefit[];
  foodImage: string;
  testimonial: {
    quote: string;
    name: string;
    image: string;
  };
  faqs: FAQ[];
  accentColor?: string;
  /** Slug for fetching admin overrides from `page_sections` (e.g. "/benefits/colitis"). */
  pageSlug?: string;
}

export default function HealthConditionPage(props: HealthConditionProps) {
  const {
    accentColor = "#274C46",
    pageSlug,
  } = props;
  const signupUrl = useSignupUrl();
  const { t, lang } = useT();

  // Admin overrides loaded from page_sections (admin store editor writes here).
  // Each section's content is keyed by `_section_index` (0=Hero, 1=What Is, 2=How Diet Helps, 3=Testimonial).
  const [overrides, setOverrides] = useState<Record<number, Record<string, unknown>> | null>(null);
  useEffect(() => {
    if (!pageSlug) return;
    let cancelled = false;
    (async () => {
      try {
        const withSlash = pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`;
        const without = pageSlug.startsWith('/') ? pageSlug.slice(1) : pageSlug;
        const { data: pages } = await supabase
          .from('pages')
          .select('id')
          .or(`slug.eq.${withSlash},slug.eq.${without}`)
          .limit(1);
        const pageId = pages?.[0]?.id;
        if (!pageId) return;
        const { data: sections } = await supabase
          .from('page_sections')
          .select('content')
          .eq('page_id', pageId);
        const map: Record<number, Record<string, unknown>> = {};
        sections?.forEach((s: { content: Record<string, unknown> | null }) => {
          const idx = (s.content?._section_index ?? s.content?._homepage_index) as number | undefined;
          if (typeof idx === 'number') map[idx] = s.content || {};
        });
        if (!cancelled) setOverrides(map);
      } catch {
        // Ignore — fall back to props.
      }
    })();
    return () => { cancelled = true; };
  }, [pageSlug]);

  // Resolve a string field with locale-aware override lookup.
  const fieldStr = (idx: number, key: string, fallback: string): string => {
    const o = overrides?.[idx];
    if (!o) return fallback;
    if (lang === 'hy') {
      const hy = (o.hy as Record<string, unknown> | undefined)?.[key];
      if (typeof hy === 'string' && hy.length > 0) return hy;
    }
    const en = o[key];
    if (typeof en === 'string' && en.length > 0) return en;
    return fallback;
  };

  // Section indices after schema expansion:
  // 0=Hero, 1=What Is, 2=Symptoms, 3=How Diet Helps, 4=Testimonial, 5=FAQs, 6=CTA
  const eyebrow = fieldStr(0, 'eyebrow', t('health.hero.eyebrow'));
  const condition = fieldStr(0, 'condition', props.condition);
  const tagline = fieldStr(0, 'tagline', props.tagline);
  const heroImage = fieldStr(0, 'hero_image', props.heroImage);
  const heroDescription = fieldStr(0, 'hero_description', props.heroDescription);
  const heroCta = fieldStr(0, 'hero_cta', t('health.hero.cta'));
  const whatIsTitle = fieldStr(1, 'what_is_title', props.whatIsTitle);
  const whatIsText = ((): string[] => {
    const t1 = fieldStr(1, 'what_is_text_1', '');
    const t2 = fieldStr(1, 'what_is_text_2', '');
    const t3 = fieldStr(1, 'what_is_text_3', '');
    const collected = [t1, t2, t3].filter(Boolean);
    return collected.length > 0 ? collected : props.whatIsText;
  })();
  const signsHeading = fieldStr(2, 'signs_heading', t('health.signs.heading'));
  const signsSubtitle = fieldStr(2, 'signs_subtitle', t('health.signs.subtitle'));
  const symptoms = ((): typeof props.symptoms => {
    const fromDb = [1, 2, 3, 4, 5, 6].map((n) => ({
      icon: fieldStr(2, `symptom_${n}_icon`, ''),
      title: fieldStr(2, `symptom_${n}_title`, ''),
      description: fieldStr(2, `symptom_${n}_description`, ''),
    })).filter((s) => s.title || s.description);
    return fromDb.length > 0 ? fromDb : props.symptoms;
  })();
  const howDietHelpsTitle = fieldStr(3, 'how_diet_title', props.howDietHelpsTitle);
  const howDietAccent = fieldStr(3, 'how_diet_accent', t('health.diet.accent'));
  const howDietHelpsText = fieldStr(3, 'how_diet_text', props.howDietHelpsText);
  const foodImage = fieldStr(3, 'food_image', props.foodImage);
  const foodBenefits = ((): typeof props.foodBenefits => {
    const fromDb = [1, 2, 3, 4, 5].map((n) => ({
      title: fieldStr(3, `food_benefit_${n}_title`, ''),
      description: fieldStr(3, `food_benefit_${n}_description`, ''),
    })).filter((b) => b.title || b.description);
    return fromDb.length > 0 ? fromDb : props.foodBenefits;
  })();
  const testimonial = {
    quote: fieldStr(4, 'testimonial_quote', props.testimonial.quote),
    name: fieldStr(4, 'testimonial_name', props.testimonial.name),
    image: fieldStr(4, 'testimonial_image', props.testimonial.image),
  };
  const faqsHeading = fieldStr(5, 'faqs_heading', t('health.faqs.heading'));
  const faqs = ((): typeof props.faqs => {
    const fromDb = [1, 2, 3, 4, 5, 6].map((n) => ({
      question: fieldStr(5, `faq_${n}_question`, ''),
      answer: fieldStr(5, `faq_${n}_answer`, ''),
    })).filter((f) => f.question || f.answer);
    return fromDb.length > 0 ? fromDb : props.faqs;
  })();
  const ctaHeading = fieldStr(6, 'cta_heading', t('health.cta.heading'));
  const ctaSubtitle = fieldStr(6, 'cta_subtitle', t('health.cta.subtitle'));
  const ctaDescription = fieldStr(6, 'cta_description', t('health.cta.description'));
  const ctaButton = fieldStr(6, 'cta_button', t('health.cta.button'));
  const ctaImage = fieldStr(6, 'cta_image', '');
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* Hero */}
        <section
          className="relative w-full overflow-hidden"
          style={{ minHeight: "520px" }}
        >
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={condition}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-green/90 via-deep-green/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-24">
            <div className="max-w-[560px]">
              <p className="text-gold font-semibold text-sm tracking-wide uppercase mb-3">
                <HyText en={eyebrow} />
              </p>
              <h1 className="font-rubik text-white text-[36px] md:text-[48px] font-bold leading-[1.12] mb-5">
                <HyText en={condition} />{" "}
                <span className="text-gold italic"><HyText en={tagline} /></span>
              </h1>
              <p className="text-white/90 text-[17px] leading-relaxed mb-8 max-w-[480px]">
                <HyText en={heroDescription} />
              </p>
              <Link
                href={signupUrl}
                className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
              >
                <HyText en={heroCta} />
              </Link>
            </div>
          </div>
        </section>

        {/* What is it */}
        <section className="bg-off-white py-14 md:py-20">
          <div className="max-w-[900px] mx-auto px-6">
            <h2 className="font-rubik text-[28px] md:text-[36px] font-bold text-deep-green leading-tight mb-6">
              <HyText en={whatIsTitle} />
            </h2>
            <div className="space-y-4">
              {whatIsText.map((para, i) => (
                <p
                  key={i}
                  className="text-deep-green/85 text-[16px] leading-[1.8]"
                >
                  <HyText en={para} />
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Symptoms / Signs */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <h2 className="font-rubik text-[26px] md:text-[32px] font-bold text-deep-green text-center mb-3">
              <HyText en={signsHeading} />
            </h2>
            <p className="text-deep-green/60 text-center mb-10 max-w-lg mx-auto">
              <HyText en={signsSubtitle} />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {symptoms.map((s, i) => (
                <div
                  key={i}
                  className="bg-off-white rounded-2xl p-6 border border-gray-100"
                >
                  <span className="text-3xl mb-3 block">{s.icon}</span>
                  <h3 className="font-rubik font-bold text-deep-green text-lg mb-2">
                    <HyText en={s.title} />
                  </h3>
                  <p className="text-deep-green/70 text-[14px] leading-relaxed">
                    <HyText en={s.description} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How diet helps - split layout */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[440px]">
            <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-[440px]">
              <Image
                src={foodImage}
                alt="Natural dog food"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-[55%] bg-off-white flex items-center">
              <div className="px-8 md:px-14 lg:px-20 py-12 md:py-16">
                <h2 className="font-rubik text-[26px] md:text-[34px] font-bold text-deep-green leading-tight mb-2">
                  <HyText en={howDietHelpsTitle} />
                </h2>
                <p className="text-gold text-[22px] font-semibold font-rubik mb-6 italic">
                  <HyText en={howDietAccent} />
                </p>
                <p className="text-deep-green/85 text-[15px] leading-[1.8] mb-6">
                  <HyText en={howDietHelpsText} />
                </p>
                <div className="space-y-4">
                  {foodBenefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: accentColor }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-deep-green text-[15px]">
                          <HyText en={b.title} />
                        </p>
                        <p className="text-deep-green/70 text-[14px] leading-relaxed">
                          <HyText en={b.description} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-deep-green py-14 md:py-20">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden relative">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <blockquote className="text-white/90 text-[17px] md:text-[19px] leading-relaxed italic mb-6 max-w-[640px] mx-auto">
              &ldquo;<HyText en={testimonial.quote} />&rdquo;
            </blockquote>
            <p className="text-gold font-semibold text-[15px]">
              {testimonial.name}
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-off-white py-14 md:py-20">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="font-rubik text-[26px] md:text-[32px] font-bold text-deep-green text-center mb-10">
              <HyText en={faqsHeading} />
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-rubik font-semibold text-deep-green text-[16px] flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                    <HyText en={faq.question} />
                    <svg
                      className="w-5 h-5 text-deep-green/40 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-deep-green/75 text-[15px] leading-[1.75]">
                      <HyText en={faq.answer} />
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[380px]">
            <div className="w-full md:w-[55%] bg-[#5F295E] flex items-center">
              <div className="px-8 md:px-14 lg:px-20 py-12 md:py-16">
                <h2 className="text-[28px] md:text-[36px] font-bold text-white font-rubik leading-tight mb-1">
                  <HyText en={ctaHeading} />
                </h2>
                <p className="text-gold text-[24px] md:text-[32px] font-bold font-rubik mb-6 italic">
                  <HyText en={ctaSubtitle} />
                </p>
                <p className="text-white/85 text-[15px] leading-[1.75] mb-8 max-w-md">
                  <HyText en={ctaDescription} />
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
                >
                  <HyText en={ctaButton} />
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-[380px]">
              <Image
                src={ctaImage || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"}
                alt="Happy healthy dog"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
