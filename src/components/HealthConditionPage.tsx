"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSignupUrl } from "@/lib/useSignupUrl";

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
}

export default function HealthConditionPage({
  condition,
  tagline,
  heroImage,
  heroDescription,
  whatIsTitle,
  whatIsText,
  symptoms,
  howDietHelpsTitle,
  howDietHelpsText,
  foodBenefits,
  foodImage,
  testimonial,
  faqs,
  accentColor = "#274C46",
}: HealthConditionProps) {
  const signupUrl = useSignupUrl();
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
                Health & Nutrition
              </p>
              <h1 className="font-rubik text-white text-[36px] md:text-[48px] font-bold leading-[1.12] mb-5">
                {condition}{" "}
                <span className="text-gold italic">{tagline}</span>
              </h1>
              <p className="text-white/90 text-[17px] leading-relaxed mb-8 max-w-[480px]">
                {heroDescription}
              </p>
              <Link
                href={signupUrl}
                className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
              >
                Create your dog&apos;s plan
              </Link>
            </div>
          </div>
        </section>

        {/* What is it */}
        <section className="bg-off-white py-14 md:py-20">
          <div className="max-w-[900px] mx-auto px-6">
            <h2 className="font-rubik text-[28px] md:text-[36px] font-bold text-deep-green leading-tight mb-6">
              {whatIsTitle}
            </h2>
            <div className="space-y-4">
              {whatIsText.map((para, i) => (
                <p
                  key={i}
                  className="text-deep-green/85 text-[16px] leading-[1.8]"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Symptoms / Signs */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <h2 className="font-rubik text-[26px] md:text-[32px] font-bold text-deep-green text-center mb-3">
              Signs to look out for
            </h2>
            <p className="text-deep-green/60 text-center mb-10 max-w-lg mx-auto">
              If your dog is showing any of these symptoms, their diet could make
              a real difference.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {symptoms.map((s, i) => (
                <div
                  key={i}
                  className="bg-off-white rounded-2xl p-6 border border-gray-100"
                >
                  <span className="text-3xl mb-3 block">{s.icon}</span>
                  <h3 className="font-rubik font-bold text-deep-green text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-deep-green/70 text-[14px] leading-relaxed">
                    {s.description}
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
                  {howDietHelpsTitle}
                </h2>
                <p className="text-gold text-[22px] font-semibold font-rubik mb-6 italic">
                  the right nutrition
                </p>
                <p className="text-deep-green/85 text-[15px] leading-[1.8] mb-6">
                  {howDietHelpsText}
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
                          {b.title}
                        </p>
                        <p className="text-deep-green/70 text-[14px] leading-relaxed">
                          {b.description}
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
              &ldquo;{testimonial.quote}&rdquo;
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
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-rubik font-semibold text-deep-green text-[16px] flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                    {faq.question}
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
                      {faq.answer}
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
                  Ready to help your
                </h2>
                <p className="text-gold text-[24px] md:text-[32px] font-bold font-rubik mb-6 italic">
                  dog feel better?
                </p>
                <p className="text-white/85 text-[15px] leading-[1.75] mb-8 max-w-md">
                  Tell us about your dog and we&apos;ll create a tailored meal
                  plan designed to support their specific needs. Vet-approved,
                  trusted by thousands.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-gold text-deep-green px-7 py-3 rounded-[5px] font-semibold text-[16px] hover:bg-[#d99500] transition-colors"
                >
                  Discover your dog&apos;s menu
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
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
