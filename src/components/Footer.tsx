"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const jekoLinks = [
  { label: "Our story", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Recipes", href: "/recipes" },
  { label: "Beyond the bowl", href: "/beyond-the-bowl" },
  { label: "Shop", href: "/products" },
  { label: "Community", href: "/community" },
];

const helpLinks = [
  { label: "My account", href: "/profile" },
  { label: "Contact us", href: "/contact" },
  { label: "Delivery information", href: "/delivery-information" },
  { label: "Returns", href: "/returns" },
  { label: "Sitemap", href: "/sitemap-page" },
];

const infoLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-of-use" },
  { label: "Pure policies", href: "/pure-policies" },
  { label: "Site security", href: "/site-security" },
  { label: "Cookie policy", href: "/cookie-policy" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ content }: { content?: any }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-deep-green text-off-white pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* VIP + Social */}
          <div className="lg:w-[35%]">
            <h4 className="text-white font-semibold text-[18px] mb-3">{content?.vip_heading || "Join our VIP list"}</h4>
            <p className="text-off-white/80 text-[15px] mb-5 leading-relaxed">
              {content?.vip_description || "Be the first to hear about new product launches, exclusive competitions and helpful dog content."}
            </p>
            <div className="flex gap-2 mb-8">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-[5px] bg-white text-deep-green text-[15px] placeholder-gray-400 outline-none"
              />
              <button className="px-5 py-3 bg-white text-deep-green font-semibold rounded-[5px] hover:bg-off-white transition-colors text-[15px]">
                {content?.signup_button_text || "Sign up"}
              </button>
            </div>

            <h4 className="text-white font-semibold text-[18px] mb-3">{content?.social_heading || "Follow us on social media"}</h4>
            <div className="flex gap-4 items-center">
              {/* Instagram */}
              <a href={content?.instagram_url || "https://www.instagram.com/purepetfood"} className="opacity-80 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Image
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect width='28' height='28' fill='%23FF1493'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle' dy='.3em'%3EIG%3C/text%3E%3C/svg%3E"
                  alt="Instagram"
                  width={28}
                  height={28}
                  unoptimized
                />
              </a>
              {/* Facebook */}
              <a href={content?.facebook_url || "https://www.facebook.com/purepetfood"} className="opacity-80 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Image
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect width='28' height='28' fill='%231877F2'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='white' text-anchor='middle' dy='.3em'%3EFB%3C/text%3E%3C/svg%3E"
                  alt="Facebook"
                  width={28}
                  height={28}
                  unoptimized
                />
              </a>
              {/* TikTok */}
              <a href={content?.tiktok_url || "https://www.tiktok.com/@purepetfood"} className="text-off-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 48 48">
                  <path fill="#fff" d="M33.2 11.64A8.56 8.56 0 0 1 31.08 6H24.9v24.8a5.18 5.18 0 0 1-5.18 5c-2.84 0-5.2-2.32-5.2-5.2 0-3.44 3.32-6.02 6.74-4.96v-6.32c-6.9-.92-12.94 4.44-12.94 11.28 0 6.66 5.52 11.4 11.38 11.4 6.28 0 11.38-5.1 11.38-11.4V18.02a14.7 14.7 0 0 0 8.6 2.76V14.6s-3.76.18-6.48-2.96" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:w-[65%] grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Pure Column */}
            <div>
              <h4 className="text-white font-semibold text-[18px] mb-4">{content?.col1_heading || "Jeko"}</h4>
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
              <h4 className="text-white font-semibold text-[18px] mb-4">{content?.col2_heading || "Help"}</h4>
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
              <h4 className="text-white font-semibold text-[18px] mb-4">{content?.col3_heading || "Information"}</h4>
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
            <div
              className="bg-gold text-deep-green rounded-lg px-3 py-1.5 flex items-center gap-1 select-none inline-flex"
              style={{ transform: 'rotate(-10deg)' }}
            >
              <span
                className="text-[24px] leading-none"
                style={{
                  fontFamily: "'Luckiest Guy', cursive",
                  letterSpacing: '2px',
                }}
              >
                JEKO
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block ml-0.5">
                <ellipse cx="8" cy="6.5" rx="2.2" ry="2.8" />
                <ellipse cx="16" cy="6.5" rx="2.2" ry="2.8" />
                <ellipse cx="4.5" cy="12" rx="2" ry="2.5" />
                <ellipse cx="19.5" cy="12" rx="2" ry="2.5" />
                <path d="M7.5 16.5C7.5 14 9.5 12.5 12 12.5C14.5 12.5 16.5 14 16.5 16.5C16.5 19 14.5 21 12 21C9.5 21 7.5 19 7.5 16.5Z" />
              </svg>
            </div>
          </div>
          <p className="text-off-white/60 text-[14px]">
            {content?.copyright_text || "\u00a9 Jeko 2020-2026"}
          </p>
        </div>
      </div>
    </footer>
  );
}
