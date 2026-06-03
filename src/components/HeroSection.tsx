"use client";

import Image from "next/image";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";
import { dynButtonStyle, dynFontStyle, dynFontClass } from "@/lib/dynamic-font-size";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSection({ content }: { content?: Record<string, any> }) {
  const { ct, lang } = useContentT(content);
  const heading = ct("heading", "home.hero.heading");
  const headingHighlight = ct("heading_highlight", "home.hero.headingHighlight");
  const subheading = ct("subheading", "home.hero.subheading");
  const buttonText = ct("button_text", "home.hero.buttonText");
  const signupUrl = useSignupUrl();
  const buttonUrl = typeof content?.button_url === "string" ? content.button_url : signupUrl;
  const showButton = content?.button_visible !== false && buttonText.trim() !== "" && buttonUrl.trim() !== "";
  const bgImage = content?.background_image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&h=800&w=1920";
  const bgImageMobile = content?.background_image_mobile || bgImage;
  const showTrustpilotReviews = content?.show_trustpilot_reviews !== false;
  const trustpilotLabel = ct("trustpilot_label", "home.hero.trustpilotLabel");
  const trustpilotScoreText = ct("trustpilot_score_text", "home.hero.trustpilotScoreText");
  const trustpilotScore = parseFloat(content?.trustpilot_score || "4.6");
  const fullStars = Math.min(4, Math.floor(trustpilotScore));
  const partialFill = Math.round((trustpilotScore % 1) * 100);
  return (
    <>
    <section
      className="relative w-full overflow-hidden min-h-[480px] lg:min-h-[600px]"
    >
      {/* Background image - fills entire section. Separate mobile/desktop sources. */}
      <div className="absolute inset-0">
        {/* Mobile image */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src={bgImageMobile}
            alt="Happy golden retriever dog enjoying fresh food"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
        {/* Desktop image */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={bgImage}
            alt="Happy golden retriever dog enjoying fresh food"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
        {/* Subtle tint overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-container items-center px-6 lg:px-8">
        <div className="w-full max-w-[560px] py-12 md:py-16">
          {/* H1 Heading - milky white per client */}
          <h1
            className={`font-frankfurter ${dynFontClass(content, "heading")}`}
            style={{
              fontSize: "50px",
              fontWeight: "normal",
              lineHeight: "1.04",
              color: "#F5F1EB",
              textShadow: "0 2px 12px rgba(0,0,0,0.25)",
              ...dynFontStyle(content, "heading", lang),
            }}
          >
            {heading}
            <br />
            <span
              className={`text-gold ${dynFontClass(content, "heading_highlight")}`}
              style={dynFontStyle(content, "heading_highlight", lang)}
            >
              {headingHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-6 font-rubik ${dynFontClass(content, "subheading")}`}
            style={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "1.4",
              color: "#F5F1EB",
              textShadow: "0 1px 8px rgba(0,0,0,0.25)",
              ...dynFontStyle(content, "subheading", lang),
            }}
          >
            {subheading}
          </p>

          {/* CTA Button */}
          {showButton && (
          <div className="mt-8">
            <a
              href={buttonUrl}
              className="inline-flex min-h-[58px] min-w-[168px] items-center justify-center rounded-full border-2 border-gold bg-gold px-10 py-4 text-center font-rubik text-[18px] font-bold leading-none text-deep-green no-underline transition-all duration-300 hover:border-[#d99500] hover:bg-[#d99500] hover:shadow-lg md:min-h-[64px] md:min-w-[196px] md:px-12 md:text-[20px]"
              style={{
                ...dynButtonStyle(content, "button_text", lang),
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                fontSize: `max(var(--fs-desktop, 20px), 18px)`,
                lineHeight: 1,
              }}
            >
              {buttonText}
            </a>
          </div>
          )}

          {/* Trustpilot-style badge */}
          {showTrustpilotReviews && (
          <div className="mt-6 flex items-center gap-2">
            {/* Trustpilot star icon */}
            <div className="flex items-center gap-0.5">
              {/* Full green stars */}
              {[...Array(fullStars)].map((_, i) => (
                <span
                  key={i}
                  className="inline-flex h-[22px] w-[22px] items-center justify-center"
                  style={{ backgroundColor: "#00B67A" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </span>
              ))}
              {/* Partial star */}
              {partialFill > 0 && (
                <span
                  className="relative inline-flex h-[22px] w-[22px] items-center justify-center overflow-hidden"
                  style={{ backgroundColor: "#DCE8E2" }}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "#00B67A",
                      width: `${partialFill}%`,
                    }}
                  />
                  <svg
                    className="relative z-10"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </span>
              )}
            </div>

            {/* Rating text */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold" style={{ color: "#F5F1EB" }}>
                {trustpilotLabel}
              </span>
              <span className="text-sm" style={{ color: "rgba(245,241,235,0.85)" }}>
                {trustpilotScoreText}
              </span>
              {/* Trustpilot logo */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#00B67A"
                />
              </svg>
              <span className="text-xs font-medium" style={{ color: "rgba(245,241,235,0.75)" }}>
                Trustpilot
              </span>
            </div>
          </div>
          )}
        </div>
      </div>

    </section>
    {/* Clean transition - no zigzag */}
    </>
  );
}
