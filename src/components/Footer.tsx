"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/LangProvider";
import { useContentT } from "@/lib/i18n/useContentT";

type FooterLink = { label: string; href: string };
type FooterColumn = { label: string; href: string; links: FooterLink[] };

function normalizeFooterColumns(value: unknown): FooterColumn[] | null {
  if (!Array.isArray(value)) return null;
  const columns = value
    .map((raw) => {
      const item = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
      const label = typeof item.label === "string" ? item.label.trim() : "";
      if (!label || item.visible === false) return null;
      const links = Array.isArray(item.children)
        ? item.children
            .map((rawChild) => {
              const child = rawChild && typeof rawChild === "object" ? rawChild as Record<string, unknown> : {};
              const childLabel = typeof child.label === "string" ? child.label.trim() : "";
              const href = typeof child.url === "string" && child.url.trim() ? child.url : "/";
              if (!childLabel || child.visible === false) return null;
              return { label: childLabel, href };
            })
            .filter((link): link is FooterLink => link !== null)
        : [];
      return {
        label,
        href: typeof item.url === "string" ? item.url : "",
        links,
      };
    })
    .filter((column): column is FooterColumn => column !== null);
  return columns.length > 0 ? columns : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ content }: { content?: any }) {
  const { t } = useT();
  const { ct } = useContentT(content);
  const ddVisible = (v: unknown) => v !== false;
  const buildLinks = (
    prefix: string,
    fallbacks: { label: string; href: string }[],
  ): { label: string; href: string }[] => {
    if (!content) return fallbacks;
    const c = content as Record<string, unknown>;
    return fallbacks
      .map((fb, i) => {
        const idx = i + 1;
        if (!ddVisible(c[`${prefix}_${idx}_visible`])) return null;
        const labelKey = `${prefix}_${idx}_label`;
        const label = Object.prototype.hasOwnProperty.call(c, labelKey) ? ct(labelKey, '') : fb.label;
        return {
          label,
          href: (c[`${prefix}_${idx}_url`] as string) ?? fb.href,
        };
      })
      .filter((x): x is { label: string; href: string } => x !== null);
  };
  const jekoLinks = buildLinks('col1_link', [
    { label: t("footer.links.ourStory"), href: "/about" },
    { label: t("footer.links.reviews"), href: "/reviews" },
    { label: t("footer.links.recipes"), href: "/recipes" },
    { label: t("footer.links.beyond"), href: "/beyond-the-bowl" },
    { label: t("footer.links.shop"), href: "/products" },
    { label: t("footer.links.community"), href: "/community" },
  ]);
  const helpLinks = buildLinks('col2_link', [
    { label: t("footer.links.myAccount"), href: "/profile" },
    { label: t("footer.links.contact"), href: "/contact" },
    { label: t("footer.links.delivery"), href: "/delivery-information" },
    { label: t("footer.links.returns"), href: "/returns" },
    { label: t("footer.links.sitemap"), href: "/sitemap-page" },
  ]);
  const infoLinks = buildLinks('col3_link', [
    { label: t("footer.links.privacy"), href: "/privacy-policy" },
    { label: t("footer.links.terms"), href: "/terms-of-use" },
    { label: t("footer.links.jekoPolicies"), href: "/pure-policies" },
    { label: t("footer.links.security"), href: "/site-security" },
    { label: t("footer.links.cookies"), href: "/cookie-policy" },
  ]);
  const footerColumns = normalizeFooterColumns(content?.footer_columns) ?? [
    { label: ct("col1_heading", "footer.col1.heading"), href: "", links: jekoLinks },
    { label: ct("col2_heading", "footer.col2.heading"), href: "", links: helpLinks },
    { label: ct("col3_heading", "footer.col3.heading"), href: "", links: infoLinks },
  ];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const visible = (v: unknown) => v !== false;
  const showVip = visible(content?.vip_visible);
  const showNewsletter = showVip && visible(content?.newsletter_visible);
  const showSocial = visible(content?.social_visible);
  const showColumns = visible(content?.columns_visible) && footerColumns.some((column) => column.links.length > 0);
  const showBottom = visible(content?.bottom_visible);
  const hasInstagram = showSocial && content?.instagram_url && content.instagram_url !== "#";
  const hasFacebook = showSocial && content?.facebook_url && content.facebook_url !== "#";
  const hasTiktok = showSocial && content?.tiktok_url && content.tiktok_url !== "#";
  const hasSocials = Boolean(hasInstagram || hasFacebook || hasTiktok);
  const showLeftColumn = showVip || hasSocials;

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
        <div className={`flex flex-col lg:flex-row gap-12 ${showBottom ? "mb-12" : ""}`}>
          {/* VIP + Social */}
          {showLeftColumn && (
            <div className="lg:w-[35%]">
              {showVip && (
                <>
                  <h4 className="text-white font-semibold text-[18px] mb-3">{ct("vip_heading", "footer.vip.heading")}</h4>
                  <p className="text-off-white/80 text-[15px] mb-5 leading-relaxed">
                    {ct("vip_description", "footer.vip.description")}
                  </p>
                  {showNewsletter && (
                    status === "success" ? (
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
                    )
                  )}
                  {showNewsletter && status === "error" && <p className="text-red-400 text-sm -mt-6 mb-6">{t("footer.vip.error")}</p>}
                </>
              )}

              {hasSocials && (
                <>
                <h4 className="text-white font-semibold text-[18px] mb-3">{ct("social_heading", "footer.social.heading")}</h4>
                <div className="flex gap-4 items-center">
                  {hasInstagram && (
                    <a href={content.instagram_url} aria-label="Instagram" className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded text-white text-[11px] font-bold" style={{ backgroundColor: "var(--social-instagram)" }} target="_blank" rel="noopener noreferrer">
                      IG
                    </a>
                  )}
                  {hasFacebook && (
                    <a href={content.facebook_url} aria-label="Facebook" className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded text-white text-[11px] font-bold" style={{ backgroundColor: "var(--social-facebook)" }} target="_blank" rel="noopener noreferrer">
                      FB
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
          )}

          {/* Link Columns */}
          {showColumns && (
            <div className={`${showLeftColumn ? "lg:w-[65%]" : "w-full"} grid grid-cols-2 md:grid-cols-3 gap-8`}>
              {footerColumns.filter((column) => column.links.length > 0).map((column) => (
                <div key={column.label}>
                  <h4 className="text-white font-semibold text-[18px] mb-4">
                    {column.href ? (
                      <Link href={column.href} className="hover:text-gold transition-colors">{column.label}</Link>
                    ) : column.label}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={`${column.label}-${link.label}`}>
                        <Link href={link.href} className="text-off-white/80 hover:text-white transition-colors text-[15px]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom - Logo + Copyright */}
        {showBottom && (
          <div className="border-t border-white/10 pt-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            {content?.logo_image ? (
              <img src={content.logo_image} alt="JEKO" className="h-10 w-auto" />
            ) : (
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
            )}
          </div>
          <p className="text-off-white/60 text-[14px]">
            {ct("copyright_text", "footer.copyrightDefault")}
          </p>
          </div>
        )}
      </div>
    </footer>
  );
}
