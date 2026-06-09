"use client";

import Image from "next/image";
import Link from "next/link";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";
import { dynFontClass, dynFontStyle } from "@/lib/dynamic-font-size";
import { normalizeContentUrl } from "@/lib/content-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlayfulSignupCTA({ content }: { content?: Record<string, any> }) {
  const { lang } = useContentT(content);
  const signupUrl = useSignupUrl();
  const contentString = (key: string) => {
    if (lang === "hy") {
      const hy = content?.hy as Record<string, unknown> | undefined;
      if (hy && Object.prototype.hasOwnProperty.call(hy, key)) {
        return typeof hy[key] === "string" ? hy[key] : "";
      }
    }
    return Object.prototype.hasOwnProperty.call(content || {}, key)
      ? String(content?.[key] ?? "")
      : "";
  };
  const sharedString = (key: string, fallback: string) => (
    Object.prototype.hasOwnProperty.call(content || {}, key)
      ? String(content?.[key] ?? "")
      : fallback
  );
  const heading = contentString("heading");
  const subheading = contentString("subheading");
  const buttonText = contentString("button_text");
  const buttonUrl = normalizeContentUrl(contentString("button_url"), signupUrl);
  const showButton = content?.button_visible !== false && buttonText.trim() !== "" && buttonUrl.trim() !== "";
  const backgroundColor = sharedString("background_color", "#F8F2E8");
  const headingColor = sharedString("heading_color", "#274C46");
  const subheadingColor = sharedString("subheading_color", "#274C46");
  const buttonBackgroundColor = sharedString("button_background_color", "#F2A900");
  const buttonTextColor = sharedString("button_text_color", "#274C46");
  const dogBadgeImage = sharedString("dog_badge_image", "/cta-assets/register-dog-badge.png?v=2");
  const pawBadgeImage = sharedString("paw_badge_image", "/cta-assets/register-paw-badge.png?v=2");
  const accentColor1 = sharedString("accent_color_1", "#F2A900");
  const accentColor2 = sharedString("accent_color_2", "#5F295E");
  const accentColor3 = sharedString("accent_color_3", "#E65A1E");

  return (
    <section className="relative overflow-hidden py-14 md:py-20" style={{ backgroundColor }}>
      {/* Floating playful blobs */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: accentColor1 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full opacity-30 blur-2xl"
        style={{ background: accentColor2 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-1/4 h-16 w-16 rounded-full opacity-30 blur-xl"
        style={{ background: accentColor3 }}
      />

      <div className="relative mx-auto flex max-w-container flex-col items-center px-6 text-center lg:px-8">
        {heading.trim() !== "" && (
        <h2
          className={dynFontClass(content, "heading")}
          style={{
            color: headingColor,
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.15,
            letterSpacing: "0",
            ...dynFontStyle(content, "heading", lang),
          }}
        >
          {heading}
        </h2>
        )}
        {subheading.trim() !== "" && (
        <p
          className={`mt-4 max-w-2xl ${dynFontClass(content, "subheading")}`}
          style={{
            color: subheadingColor,
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.5,
            ...dynFontStyle(content, "subheading", lang),
          }}
        >
          {subheading}
        </p>
        )}

        {showButton && (
        <Link
          href={buttonUrl}
          className={`group relative mt-8 flex h-[60px] w-full max-w-[390px] items-center justify-center rounded-full border-[4px] px-[72px] text-center shadow-[0_10px_18px_rgba(204,91,0,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_22px_rgba(204,91,0,0.28)] active:translate-y-0 active:shadow-[0_7px_14px_rgba(204,91,0,0.22)] sm:h-[68px] sm:max-w-[500px] sm:px-[98px] ${dynFontClass(content, "button_text")}`}
          style={{
            background: `linear-gradient(90deg, ${buttonBackgroundColor} 0%, #ff8b1a 100%)`,
            borderColor: buttonBackgroundColor,
            color: buttonTextColor,
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontSize: "clamp(16px, 1.8vw, 22px)",
            fontWeight: 700,
            letterSpacing: "0",
            ...dynFontStyle(content, "button_text", lang),
          }}
        >
          <span
            aria-hidden="true"
            className="absolute left-[-14px] top-1/2 h-[76px] w-[76px] -translate-y-1/2 overflow-hidden rounded-full border-[3px] bg-[#fbefe0] shadow-[0_8px_16px_rgba(95,45,0,0.24)] sm:left-[-22px] sm:h-[96px] sm:w-[96px]"
            style={{ borderColor: buttonBackgroundColor }}
          >
            <Image
              src={dogBadgeImage}
              alt=""
              fill
              sizes="96px"
              className="scale-[1.12] object-cover"
              priority={false}
              unoptimized
            />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[22%] top-1/2 hidden h-7 w-8 -translate-y-1/2 rotate-[-12deg] opacity-25 sm:block"
          >
            <span className="absolute left-[10px] top-[10px] h-4 w-5 rounded-[55%_55%_45%_45%] bg-[#ffbf45] shadow-[inset_0_2px_3px_rgba(255,255,255,0.35),0_2px_4px_rgba(190,83,0,0.22)]" />
            <span className="absolute left-[1px] top-[8px] h-2.5 w-2 rounded-full bg-[#ffbf45] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]" />
            <span className="absolute left-[8px] top-[1px] h-3 w-2.5 rounded-full bg-[#ffbf45] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]" />
            <span className="absolute left-[18px] top-[1px] h-3 w-2.5 rounded-full bg-[#ffbf45] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]" />
            <span className="absolute right-[0px] top-[8px] h-2.5 w-2 rounded-full bg-[#ffbf45] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]" />
          </span>
          <span className="relative z-10 leading-tight">{buttonText}</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[28%] top-1/2 hidden h-5 w-6 -translate-y-1/2 rotate-[15deg] opacity-20 sm:block"
          >
            <span className="absolute left-[8px] top-[8px] h-3 w-4 rounded-[55%_55%_45%_45%] bg-[#ffbf45] shadow-[inset_0_2px_3px_rgba(255,255,255,0.35),0_2px_4px_rgba(190,83,0,0.2)]" />
            <span className="absolute left-[0px] top-[6px] h-2 w-1.5 rounded-full bg-[#ffbf45]" />
            <span className="absolute left-[6px] top-[0px] h-2.5 w-2 rounded-full bg-[#ffbf45]" />
            <span className="absolute left-[14px] top-[0px] h-2.5 w-2 rounded-full bg-[#ffbf45]" />
            <span className="absolute right-[0px] top-[6px] h-2 w-1.5 rounded-full bg-[#ffbf45]" />
          </span>
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-1/2 h-[44px] w-[44px] -translate-y-1/2 overflow-hidden rounded-full bg-white shadow-[0_5px_12px_rgba(120,60,0,0.18)] sm:right-4 sm:h-[54px] sm:w-[54px]"
          >
            <Image
              src={pawBadgeImage}
              alt=""
              fill
              sizes="54px"
              className="scale-[1.04] object-cover"
              priority={false}
              unoptimized
            />
          </span>
        </Link>
        )}
      </div>
    </section>
  );
}
