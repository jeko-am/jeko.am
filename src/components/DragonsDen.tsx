"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DragonsDen({ content }: { content?: any }) {
  const signupUrl = useSignupUrl();
  const { ct } = useContentT(content);
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[480px]">
        {/* Image Left Side - ~43% with vertical zigzag right edge */}
        <div className="w-full md:w-[43%] relative min-h-[300px] md:min-h-[480px]">
          <Image
            src={content?.image || "https://www.datocms-assets.com/55536/1680101718-dragons-den-dog-food.jpg?auto=format&fit=crop&h=600&w=1000"}
            alt="Jeko on Dragons Den"
            fill
            unoptimized
            className="object-cover"
          />
          {/* Decorative elements overlaid on image */}
          <div className="absolute left-0 bottom-0 pointer-events-none hidden md:block">
            <svg viewBox="0 0 120 200" className="w-28 h-48">
              <path d="M-10 140 Q20 110 40 135 Q30 160 10 160 Q-10 155 -10 140Z" fill="#E65A1E" opacity="0.7" />
              <path d="M20 170 Q40 155 55 170 Q45 190 25 185 Q10 180 20 170Z" fill="#E88B7D" opacity="0.6" />
            </svg>
          </div>
          {/* Vertical zigzag on right edge - teeth pointing LEFT into image, color follows section bg */}
          <div
            className="hidden md:block absolute right-0 top-0 h-full z-10 zigzag-vertical-right"
            style={{
              ['--zigzag-color' as string]: content?.background_color || '#274C46',
            } as React.CSSProperties}
          />
        </div>

        {/* Text Right Side - ~57% */}
        <div className="w-full md:w-[57%] flex items-center" style={{ backgroundColor: content?.background_color || '#274C46' }}>
          <div className="px-8 md:px-16 lg:px-24 py-12">
            <h2 className="text-[32px] md:text-[40px] font-medium text-white tracking-wide leading-tight mb-6">
              {ct("heading", "home.dragons.heading")}
            </h2>
            <p className="text-off-white text-[18px] leading-relaxed mb-8">
              {ct("description", "home.dragons.description")}
            </p>
            <Link
              href={content?.button_url || signupUrl}
              className="btn-gold inline-block font-semibold text-[18px] transition-colors duration-300"
            >
              {ct("button_text", "home.faq.getStarted")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
