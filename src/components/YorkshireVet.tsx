"use client";

import Image from "next/image";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function YorkshireVet({ content }: { content?: any }) {
  const { ct } = useContentT(content);
  // ct() returns the i18n fallback when content[key] is missing. To let the
  // client clear a field from the store editor we treat an explicit empty
  // string in `content` as "hide this line".
  const hasOwn = (k: string) => Object.prototype.hasOwnProperty.call(content ?? {}, k);
  const heading = hasOwn("heading") ? content!.heading : ct("heading", "home.vet.heading");
  const author = hasOwn("author") ? content!.author : ct("author", "home.vet.authorName");
  const quote = hasOwn("quote") ? content!.quote : ct("quote", "home.vet.quoteText");
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[480px]">
        {/* Text Left Side - larger */}
        <div className="w-full md:w-[58%] bg-off-white flex items-center relative">
          {/* Decorative illustrations on left */}
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden">
            <svg viewBox="0 0 400 450" className="absolute left-0 top-0 w-48 h-full opacity-60">
              {/* Pink splash */}
              <path d="M-20 120 Q20 80 60 110 Q80 70 50 40 Q80 20 110 50 Q130 30 100 0 L0 0 Z" fill="#E88B7D" opacity="0.5" />
              {/* Green leaf */}
              <ellipse cx="40" cy="320" rx="30" ry="50" fill="#274C46" opacity="0.3" transform="rotate(-20 40 320)" />
              <ellipse cx="60" cy="360" rx="20" ry="40" fill="#274C46" opacity="0.25" transform="rotate(10 60 360)" />
              {/* Yellow kibble shapes */}
              <ellipse cx="50" cy="200" rx="12" ry="8" fill="#F2A900" opacity="0.6" transform="rotate(30 50 200)" />
              <ellipse cx="30" cy="230" rx="10" ry="7" fill="#F2A900" opacity="0.5" transform="rotate(-20 30 230)" />
              <ellipse cx="65" cy="250" rx="11" ry="7" fill="#F2A900" opacity="0.5" transform="rotate(45 65 250)" />
              {/* Purple circle */}
              <circle cx="70" cy="290" r="20" fill="#5F295E" opacity="0.6" />
              <path d="M62 284 Q70 276 78 284 L78 286 Q74 282 70 286 Q66 282 62 286 Z" fill="white" opacity="0.8" />
            </svg>
          </div>

          <div className="px-12 md:px-16 lg:px-24 py-12 relative z-10">
            {heading ? (
              <h2 className="text-[32px] md:text-[40px] font-medium text-deep-green tracking-wide leading-tight mb-2">
                {heading}
              </h2>
            ) : null}
            {author ? (
              <p className="text-[#6B8E3A] text-[32px] md:text-[38px] font-medium tracking-wide mb-6">
                {author}
              </p>
            ) : null}
            {quote ? (
              <p className="text-deep-green text-[18px] leading-relaxed max-w-md italic">
                {"\u201c"}{quote}{"\u201d"}
              </p>
            ) : null}
          </div>
        </div>

        {/* Image Right Side - smaller */}
        <div className="w-full md:w-[42%] relative min-h-[350px] md:min-h-[480px]">
          <Image
            src={content?.image || "https://www.datocms-assets.com/55536/1749463347-046-pure-pet-food-yorkshire-vet.jpg?auto=format&fit=crop&h=600&w=1000"}
            alt="Julian Norton - The Yorkshire Vet with Jeko"
            fill
            unoptimized
            className="object-cover"
          />
          {/* Vertical zigzag on left edge - teeth pointing RIGHT into image, color matches off-white text panel */}
          <div className="hidden md:block absolute left-0 top-0 h-full z-10 zigzag-vertical-left" />
        </div>
      </div>
    </section>
  );
}
