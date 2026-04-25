"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorOverlay from "@/components/EditorOverlay";
import HyText from "@/components/HyText";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useT } from "@/lib/i18n/LangProvider";

interface BenefitsPageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: Record<string, any>;
}

export default function BenefitsPageClient({ sections }: BenefitsPageClientProps) {
  const { t } = useT();
  const signupUrl = useSignupUrl();
  const contentSections = [
    {
      title: sections[2]?.title ?? t("benefits.section.commonSense.title"),
      text: sections[2]?.text ?? "We work on facts and common sense over here in Yorkshire. After all, we all know natural, healthy food is the best way to feed any animal. Our food is made in the UK, is full of the same ingredients you'd find in your own food and doesn't include anything you wouldn't eat yourself.",
      image: sections[2]?.image || "https://www.datocms-assets.com/55536/1673605636-delicious-dog-food.jpg?auto=format&fit=crop&h=600&w=1000",
      imageLeft: true,
      bg: "bg-off-white",
      cta: null,
      sectionIndex: 2,
    },
    {
      title: sections[3]?.title ?? t("benefits.section.noNasties.title"),
      text: sections[3]?.text ?? "We preserve our high quality natural ingredients by removing the water, meaning we don't add any preservatives, while avoiding the high temperature and high pressure extrusion process used to make traditional dry biscuit dog food. Gone are the days of mysterious brown biscuits full of nasties.",
      image: sections[3]?.image || "https://www.datocms-assets.com/55536/1673605662-personalised-dog-food.jpg?auto=format&fit=crop&h=600&w=1000",
      imageLeft: false,
      bg: "bg-white",
      cta: {
        label: sections[3]?.cta_label ?? t("benefits.readFood.cta"),
        href: sections[3]?.cta_href ?? "/recipes",
      },
      sectionIndex: 3,
    },
    {
      title: sections[4]?.title ?? t("benefits.section.longLives.title"),
      text: sections[4]?.text ?? "Studies have found that puppies fed a processed diet initially appeared to be healthy, but once they reached maturity, they were more likely to rapidly age and develop degenerative disease symptoms. We stand for fresh, healthy food for long, healthy lives.",
      image: sections[4]?.image || "https://www.datocms-assets.com/55536/1664894577-dog-walking.jpg?auto=format&fit=crop&h=600&w=1000",
      imageLeft: true,
      bg: "bg-off-white",
      cta: null,
      sectionIndex: 4,
    },
  ];

  const testimonials = [
    {
      image: sections[5]?.t1_image || "https://www.datocms-assets.com/55536/1664896642-lucy.jpg?auto=format&fit=crop&h=800&w=800",
      quote: sections[5]?.t1_quote ?? "My experience shows that the effects of feeding a highly-processed diet start to show most in later life. Young dogs often have the vitality to cope with poor quality ingredients, just like children do with fast food. It's not until mid to later life that we really start to see the issues that these inflammatory diets are linked with.",
      name: sections[5]?.t1_name ?? "Dr Lucy Williamson BVM&S",
    },
    {
      image: sections[5]?.t2_image || "https://www.datocms-assets.com/55536/1664896665-lloyd-peta.jpg?auto=format&fit=crop&h=800&w=800",
      quote: sections[5]?.t2_quote ?? "We rescued Lulu, she had a whole host of stomach and digestive issues. They were so bad that euthanasia was discussed twice by our vets. We tried everything. We found Jeko after seeing a review online, within just 2 days her issues had eased, and now 3 months on she's a different dog.",
      name: sections[5]?.t2_name ?? "Lloyd, Peta & Lulu",
    },
    {
      image: sections[5]?.t3_image || "https://www.datocms-assets.com/55536/1673543479-healthy-dog-food.jpg?auto=format&fit=crop&h=800&w=800",
      quote: sections[5]?.t3_quote ?? "We've seen a real difference in our dog's coat and energy levels since switching to Jeko. The food is clearly made with care, and the fact that every ingredient is one I recognise gives me real peace of mind. I would recommend it to anyone.",
      name: sections[5]?.t3_name ?? "Sarah, Tim & Biscuit",
    },
  ];

  return (
    <>
      <EditorOverlay />
      <Header />
      <main style={{ paddingTop: "80px" }}>
        {/* ========== Hero Section ========== */}
        <div data-section-index="0" data-section-name="Hero">
          <section
            className="relative w-full overflow-hidden"
            style={{ minHeight: "520px" }}
          >
            <div className="absolute inset-0">
              <Image
                src={sections[0]?.hero_image || "https://www.datocms-assets.com/55536/1673605577-benefits-of-healthy-dog-food.jpg?auto=format&fit=crop&h=800&w=1920"}
                alt="Benefits of healthy dog food"
                fill
                unoptimized
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep-green/85 via-deep-green/65 to-transparent" />
            </div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-24">
              <div className="max-w-[520px]">
                <h1 className="font-rubik text-white text-[38px] md:text-[48px] font-bold leading-[1.15] mb-5">
                  <HyText en={sections[0]?.heading ?? t("benefits.hero.heading")} />{" "}
                  <span className="text-gold italic">
                    <HyText en={sections[0]?.heading_highlight ?? t("benefits.hero.headingHighlight")} />
                  </span>
                </h1>
                <p className="text-white/90 text-[17px] leading-relaxed mb-8 max-w-[440px]">
                  <HyText en={sections[0]?.subheading ?? t("benefits.hero.subheading")} />
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href={sections[0]?.button_url ?? signupUrl}
                    className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
                  >
                    <HyText en={sections[0]?.button_text ?? t("benefits.hero.button")} />
                  </Link>
                  {/* Trustpilot stars */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className="inline-flex h-[22px] w-[22px] items-center justify-center"
                          style={{ backgroundColor: "#00B67A" }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        </span>
                      ))}
                      <span
                        className="relative inline-flex h-[22px] w-[22px] items-center justify-center overflow-hidden"
                        style={{ backgroundColor: "#DCE8E2" }}
                      >
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: "#00B67A", width: "70%" }}
                        />
                        <svg
                          className="relative z-10"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-white">
                      {t("benefits.trustpilot.label")}
                    </span>
                    <span className="text-[13px] text-white/70">{t("benefits.trustpilot.score")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ========== Offer Banner ========== */}
        <div data-section-index="1" data-section-name="Offer Banner">
          <Link
            href={sections[1]?.link_url ?? signupUrl}
            className="block w-full bg-[#E65A1E] hover:bg-[#D04E15] transition-colors duration-200 py-3 text-center text-white"
          >
            <p className="text-[17px] leading-snug font-rubik">
              <span className="font-bold">
                <HyText en={sections[1]?.primary_text ?? t("benefits.offer.primary")} />
              </span>
              <span className="mx-2 font-light">+</span>
              <span className="font-medium text-[15px] text-white/90">
                <HyText en={sections[1]?.secondary_text ?? t("benefits.offer.secondary")} />
              </span>
            </p>
          </Link>
        </div>

        {/* ========== Alternating Content Sections ========== */}
        {contentSections.map((section, index) => (
          <div
            key={index}
            data-section-index={section.sectionIndex}
            data-section-name={section.title}
          >
            <section className="relative overflow-hidden">
              <div
                className={`flex flex-col ${
                  section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"
                } min-h-[440px]`}
              >
                {/* Image side - smaller */}
                <div className="w-full md:w-[42%] relative min-h-[300px] md:min-h-[440px]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {/* Vertical zigzag divider */}
                  {section.imageLeft ? (
                    <div
                      className="hidden md:block absolute right-0 top-0 h-full z-10"
                      style={{
                        width: '12px',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M12,0 L0,12 L12,24 Z' fill='%23EAE5DC'/%3E%3C/svg%3E\")",
                        backgroundSize: '12px 24px',
                        backgroundRepeat: 'repeat-y',
                      }}
                    />
                  ) : (
                    <div
                      className="hidden md:block absolute left-0 top-0 h-full z-10"
                      style={{
                        width: '12px',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M0,0 L12,12 L0,24 Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                        backgroundSize: '12px 24px',
                        backgroundRepeat: 'repeat-y',
                      }}
                    />
                  )}
                </div>
                {/* Text side - larger */}
                <div
                  className={`w-full md:w-[58%] flex items-center ${section.bg}`}
                >
                  <div className="px-8 md:px-14 lg:px-20 py-12 md:py-16 max-w-[560px]">
                    <h2 className="text-[28px] md:text-[34px] font-bold text-deep-green font-rubik leading-tight mb-5">
                      <HyText en={section.title} />
                    </h2>
                    <p className="text-deep-green/90 text-[15px] leading-[1.75]">
                      <HyText en={section.text} />
                    </p>
                    {section.cta && (
                      <Link
                        href={section.cta.href}
                        className="inline-block mt-7 border-2 border-deep-green text-deep-green px-6 py-2.5 rounded-[5px] font-semibold text-[15px] hover:bg-deep-green hover:text-white transition-all duration-200"
                      >
                        <HyText en={section.cta.label} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}

        {/* ========== Vet & Customer Testimonials ========== */}
        <div data-section-index="5" data-section-name="Testimonials">
          <section className="bg-deep-green py-14 md:py-16">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="w-full h-[200px] relative">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-white/90 text-[14px] leading-[1.7] mb-4 italic">
                        &ldquo;<HyText en={t.quote} />&rdquo;
                      </p>
                      <p className="text-white font-semibold text-[13px]">
                        <HyText en={t.name} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ========== Better bellies ========== */}
        <div data-section-index="6" data-section-name="Better Bellies">
          <section className="bg-off-white py-14 md:py-20">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="md:ml-auto md:w-1/2 md:pl-10 lg:pl-16">
                <h2 className="text-[28px] md:text-[34px] font-bold text-deep-green font-rubik leading-tight mb-1">
                  <HyText en={sections[6]?.heading ?? t("benefits.bellies.heading")} />
                </h2>
                <p
                  className="text-gold text-[28px] md:text-[34px] mb-6"
                  style={{
                    fontFamily:
                      "'Caveat', 'Dancing Script', 'Satisfy', cursive",
                    fontStyle: "italic",
                    fontWeight: 600,
                    textDecoration: "underline",
                    textDecorationColor: "#F2A900",
                    textUnderlineOffset: "4px",
                    textDecorationThickness: "2px",
                  }}
                >
                  <HyText en={sections[6]?.subtitle ?? t("benefits.bellies.subtitle")} />
                </p>
                <p className="text-deep-green/90 text-[15px] leading-[1.75] max-w-[500px]">
                  <HyText en={sections[6]?.description ?? "Brown biscuits full of artificial ingredients that are scientifically designed in a lab, can often go in one way and come out the other, smelly and unpleasant. Switching to a highly digestible, high quality food will improve smell and stool consistency. A welcome change!"} />
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ========== Combat obesity ========== */}
        <div data-section-index="7" data-section-name="Combat Obesity">
          <section className="bg-white py-14 md:py-20">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="md:w-1/2 md:pr-10 lg:pr-16">
                <h2 className="text-[28px] md:text-[34px] font-bold text-deep-green font-rubik leading-tight mb-5">
                  <HyText en={sections[7]?.heading ?? t("benefits.obesity.heading")} />
                </h2>
                <div className="space-y-4">
                  <p className="text-deep-green/90 text-[15px] leading-[1.75]">
                    <HyText en={sections[7]?.text_1 ?? "According to the PFMA, 51% of dogs are overweight or obese. Obesity leads to a whole host of health issues in later life such as arthritis, diabetes and even cancer. Poor quality foods can cause your dog to eat more to feel full."} />
                  </p>
                  <p className="text-deep-green/90 text-[15px] leading-[1.75]">
                    <HyText en={sections[7]?.text_2 ?? "We know in our diet, if we eat processed food regularly, we can feel sluggish, become overweight and suffer from health issues later in life. Switching to a healthier, natural diet helps maintain a healthy body weight and combat obesity."} />
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ========== Personalise CTA - asymmetrical, purple bg ========== */}
        <div data-section-index="8" data-section-name="Personalise CTA">
          <section className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[420px]">
              <div className="w-full md:w-[55%] bg-[#5F295E] flex items-center">
                <div className="px-8 md:px-14 lg:px-20 py-12 md:py-16 max-w-[520px]">
                  <h2 className="text-[30px] md:text-[38px] font-bold text-white font-rubik leading-tight mb-1">
                    <HyText en={sections[8]?.heading ?? t("benefits.personalise.heading")} />
                  </h2>
                  <p
                    className="text-gold text-[28px] md:text-[36px] font-bold font-rubik mb-6"
                    style={{
                      fontFamily:
                        "'Caveat', 'Dancing Script', 'Satisfy', cursive",
                      fontStyle: "italic",
                      fontWeight: 600,
                      textDecoration: "underline",
                      textDecorationColor: "#F2A900",
                      textUnderlineOffset: "4px",
                      textDecorationThickness: "2px",
                    }}
                  >
                    <HyText en={sections[8]?.subtitle ?? t("benefits.personalise.subtitle")} />
                  </p>
                  <p className="text-white/85 text-[15px] leading-[1.75] mb-8 max-w-[420px]">
                    <HyText en={sections[8]?.description ?? "Proactively invest in your pet\u2019s health with a nutritious, vet-approved dog food subscription that\u2019s trusted by thousands. Discover your dog\u2019s recipe today with free dog food delivery."} />
                  </p>
                  <Link
                    href={sections[8]?.button_url ?? "/products"}
                    className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
                  >
                    <HyText en={sections[8]?.button_text ?? t("benefits.personalise.button")} />
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-[45%] relative min-h-[320px] md:min-h-[420px]">
                <Image
                  src={sections[8]?.image || "https://www.datocms-assets.com/55536/1673543479-healthy-dog-food.jpg?auto=format&fit=crop&h=600&w=1000"}
                  alt="Personalise your dog's food"
                  fill
                  unoptimized
                  className="object-cover"
                />
                {/* Vertical zigzag on left edge - purple teeth pointing RIGHT into image */}
                <div
                  className="hidden md:block absolute left-0 top-0 h-full z-10"
                  style={{
                    width: '12px',
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M0,0 L12,12 L0,24 Z' fill='%235F295E'/%3E%3C/svg%3E\")",
                    backgroundSize: '12px 24px',
                    backgroundRepeat: 'repeat-y',
                  }}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
