"use client";

import Link from "next/link";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlayfulSignupCTA({ content }: { content?: Record<string, any> }) {
  // Hooks retained for future i18n wiring; no translation keys exist for this
  // section yet, so use plain content overrides with literal fallbacks.
  useContentT(content);
  const signupUrl = useSignupUrl();
  const heading = content?.heading || "Ready to spoil them?";
  const subheading = content?.subheading || "Join thousands of happy pets — get a tailored plan in under 2 minutes.";
  const buttonText = content?.button_text || "Sign me up";
  const buttonUrl = content?.button_url || signupUrl;

  return (
    <section className="relative overflow-hidden bg-off-white py-14 md:py-20">
      {/* Floating playful blobs */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: "#F2A900" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full opacity-30 blur-2xl"
        style={{ background: "#5F295E" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-1/4 h-16 w-16 rounded-full opacity-30 blur-xl"
        style={{ background: "#E65A1E" }}
      />

      <div className="relative mx-auto flex max-w-container flex-col items-center px-6 text-center lg:px-8">
        <h2
          className="text-deep-green"
          style={{
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </h2>
        <p
          className="mt-4 max-w-2xl text-deep-green/80"
          style={{
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.5,
          }}
        >
          {subheading}
        </p>

        {/* Playful pill CTA */}
        <Link
          href={buttonUrl}
          className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-deep-green shadow-[0_8px_0_-2px_rgba(217,149,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_0_-2px_rgba(217,149,0,0.55)] active:translate-y-0 active:shadow-[0_4px_0_-2px_rgba(217,149,0,0.45)]"
          style={{
            fontFamily: "'Fredoka', 'Rubik', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          {buttonText}
          <svg
            className="transition-transform duration-200 group-hover:translate-x-1"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
