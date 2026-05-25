"use client";

import Link from "next/link";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";
import { dynFontClass, dynFontStyle } from "@/lib/dynamic-font-size";

const Sparkle = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
    aria-hidden="true"
  >
    <path
      d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
      fill="currentColor"
    />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OfferBanner({ content }: { content?: Record<string, any> }) {
  const { ct, lang } = useContentT(content);
  const signupUrl = useSignupUrl();

  const primaryText = ct("primary_text", "home.offer.primaryText");
  const secondaryText = ct("secondary_text", "home.offer.secondaryText");
  const linkUrl = typeof content?.link_url === "string" ? content.link_url : signupUrl;
  const bgColor = content?.background_color || "#5F295E";
  const showBanner = primaryText.trim() !== "" || secondaryText.trim() !== "";
  const canLink = content?.link_visible !== false && linkUrl.trim() !== "";
  if (!showBanner) return null;

  const inner = (
    <div
      className="block w-full py-3 text-center text-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-center gap-3 px-4">
        <Sparkle />
        <p className="text-lg leading-snug">
          <span
            className={`font-bold ${dynFontClass(content, "primary_text")}`}
            style={dynFontStyle(content, "primary_text", lang)}
          >
            {primaryText}
          </span>
          <span className="mx-1.5">+</span>
          <span
            className={`font-medium text-base text-white/90 ${dynFontClass(content, "secondary_text")}`}
            style={dynFontStyle(content, "secondary_text", lang)}
          >
            {secondaryText}
          </span>
        </p>
        <Sparkle />
      </div>
    </div>
  );

  if (!canLink) return inner;

  return (
    <Link href={linkUrl} className="block w-full hover:opacity-90 transition-colors duration-200">
      {inner}
    </Link>
  );
}
