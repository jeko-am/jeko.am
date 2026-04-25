"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/LangProvider";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ content }: { content?: any }) {
  const { t } = useT();
  const { ct } = useContentT(content);
  const jekoLinks = [
    { label: t("footer.links.ourStory"), href: "/about" },
    { label: t("footer.links.reviews"), href: "/reviews" },
    { label: t("footer.links.recipes"), href: "/recipes" },
    { label: t("footer.links.beyond"), href: "/beyond-the-bowl" },
    { label: t("footer.links.shop"), href: "/products" },
    { label: t("footer.links.community"), href: "/community" },
  ];
  const helpLinks = [
    { label: t("footer.links.myAccount"), href: "/profile" },
    { label: t("footer.links.contact"), href: "/contact" },
    { label: t("footer.links.delivery"), href: "/delivery-information" },
    { label: t("footer.links.returns"), href: "/returns" },
    { label: t("footer.links.sitemap"), href: "/sitemap-page" },
  ];
  const infoLinks = [
    { label: t("footer.links.privacy"), href: "/privacy-policy" },
    { label: t("footer.links.terms"), href: "/terms-of-use" },
    { label: t("footer.links.jekoPolicies"), href: "/pure-policies" },
    { label: t("footer.links.security"), href: "/site-security" },
    { label: t("footer.links.cookies"), href: "/cookie-policy" },
  ];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const hasInstagram = content?.instagram_url && content.instagram_url !== "#";
  const hasFacebook = content?.facebook_url && content.facebook_url !== "#";
  const hasTiktok = content?.tiktok_url && content.tiktok_url !== "#";
  const hasSocials = hasInstagram || hasFacebook || hasTiktok;

  async function handleSubscribe() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("saving");
    try {
      const { error } = await supabase
        .from("email_subscribers")
        .upsert({ email: email.trim().toLowerCase(), source: "footer_vip" }, { onConflict: "email" });
      if (error) throw error;
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-deep-green text-off-white pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* VIP + Social */}
          <div className="lg:w-[35%]">
            <h4 className="text-white font-semibold text-[18px] mb-3">{ct("vip_heading", "footer.vip.heading")}</h4>
            <p className="text-off-white/80 text-[15px] mb-5 leading-relaxed">
              {ct("vip_description", "footer.vip.description")}
            </p>
            {status === "success" ? (
              <p className="text-gold font-semibold text-[15px] mb-8">{t("footer.vip.thanks")}</p>
            ) : (
              <div className="flex gap-2 mb-8">
                <input
                  type="email"
                  placeholder={t("footer.vip.emailPlaceholder")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="flex-1 px-4 py-3 rounded-[5px] bg-white text-deep-green text-[15px] placeholder-gray-400 outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === "saving"}
                  className="px-5 py-3 bg-white text-deep-green font-semibold rounded-[5px] hover:bg-off-white transition-colors text-[15px] disabled:opacity-50"
                >
                  {status === "saving" ? "..." : ct("signup_button_text", "footer.vip.signup")}
                </button>
              </div>
            )}
            {status === "error" && <p className="text-red-400 text-sm -mt-6 mb-6">{t("footer.vip.error")}</p>}

            {hasSocials && (
              <>
                <h4 className="text-white font-semibold text-[18px] mb-3">{ct("social_heading", "footer.social.heading")}</h4>
                <div className="flex gap-4 items-center">
                  {hasInstagram && (
                    <a href={content.instagram_url} className="opacity-80 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect width='28' height='28' fill='%23FF1493'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle' dy='.3em'%3EIG%3C/text%3E%3C/svg%3E"
                        alt="Instagram"
                        width={28}
                        height={28}
                        unoptimized
                      />
                    </a>
                  )}
                  {hasFacebook && (
                    <a href={content.facebook_url} className="opacity-80 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect width='28' height='28' fill='%231877F2'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle' dy='.3em'%3EFB%3C/text%3E%3C/svg%3E"
                        alt="Facebook"
                        width={28}
                        height={28}
                        unoptimized
                      />
                    </a>
                  )}
                  {hasTiktok && (
                    <a href={content.tiktok_url} className="text-off-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 48 48">
                        <path fill="#fff" d="M33.2 11.64A8.56 8.56 0 0 1 31.08 6H24.9v24.8a5.18 5.18 0 0 1-5.18 5c-2.84 0-5.2-2.32-5.2-5.2 0-3.44 3.32-6.02 6.74-4.96v-6.32c-6.9-.92-12.94 4.44-12.94 11.28 0 6.66 5.52 11.4 11.38 11.4 6.28 0 11.38-5.1 11.38-11.4V18.02a14.7 14.7 0 0 0 8.6 2.76V14.6s-3.76.18-6.48-2.96" />
                      </svg>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Link Columns */}
          <div className="lg:w-[65%] grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Jeko Column */}
            <div>
              <h4 className="text-white font-semibold text-[18px] mb-4">{ct("col1_heading", "footer.col1.heading")}</h4>
              <ul className="space-y-2.5">
                {jekoLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-off-white/80 hover:text-white transition-colors text-[15px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Column */}
            <div>
              <h4 className="text-white font-semibold text-[18px] mb-4">{ct("col2_heading", "footer.col2.heading")}</h4>
              <ul className="space-y-2.5">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-off-white/80 hover:text-white transition-colors text-[15px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Column */}
            <div>
              <h4 className="text-white font-semibold text-[18px] mb-4">{ct("col3_heading", "footer.col3.heading")}</h4>
              <ul className="space-y-2.5">
                {infoLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-off-white/80 hover:text-white transition-colors text-[15px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom - Logo + Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <span
              className="text-[36px] leading-none select-none"
              style={{
                fontFamily: "'TR Frankfurter', 'Rubik', sans-serif",
                color: '#F2A900',
                transform: 'rotate(-6deg)',
                display: 'inline-block',
              }}
            >
              JEKO
            </span>
          </div>
          <p className="text-off-white/60 text-[14px]">
            {ct("copyright_text", "footer.copyrightDefault")}
          </p>
        </div>
      </div>
    </footer>
  );
}
