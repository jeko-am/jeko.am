"use client";

import Image from "next/image";
import { useContentT } from "@/lib/i18n/useContentT";

const defaultBenefits = [
  {
    icon: "https://www.purepetfood.com/_next/static/media/box-with-red-hearts.d6dbf870.png",
    key: "benefit_1",
    dictKey: "home.benefits.storeCupboard",
  },
  {
    icon: "https://www.purepetfood.com/_next/static/media/piggy-bank-pink.b9a77b6e.png",
    key: "benefit_2",
    dictKey: "home.benefits.from89p",
  },
  {
    icon: "https://www.purepetfood.com/_next/static/media/droplet-blue.991caf56.png",
    key: "benefit_3",
    dictKey: "home.benefits.addWater",
  },
  {
    icon: "https://www.purepetfood.com/_next/static/media/bowl-with-white-scoop.1ea3ccfc.png",
    key: "benefit_4",
    dictKey: "home.benefits.ready10s",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BenefitsBar({ content }: { content?: Record<string, any> }) {
  const { ct } = useContentT(content);

  const benefits = defaultBenefits.map((benefit) => ({
    ...benefit,
    text: ct(benefit.key, benefit.dictKey),
  }));

  return (
    <section className="py-12 zigzag-bottom zigzag-bottom-purple relative z-[1]" style={{ backgroundColor: content?.background_color || '#5F295E' }}>
      {/* Decorative elements - left side */}
      <div className="absolute left-0 top-0 h-full pointer-events-none hidden md:block overflow-hidden">
        <svg viewBox="0 0 120 200" className="absolute -left-4 top-4 w-28 h-44 opacity-70">
          {/* Orange splash */}
          <path d="M10 30 Q30 10 50 25 Q40 50 20 45 Q5 40 10 30Z" fill="#E65A1E" opacity="0.6" />
          {/* Green leaf */}
          <ellipse cx="35" cy="110" rx="20" ry="40" fill="#274C46" opacity="0.35" transform="rotate(-15 35 110)" />
          <ellipse cx="55" cy="140" rx="15" ry="30" fill="#274C46" opacity="0.3" transform="rotate(20 55 140)" />
        </svg>
      </div>
      {/* Decorative elements - right side */}
      <div className="absolute right-0 top-0 h-full pointer-events-none hidden md:block overflow-hidden">
        <svg viewBox="0 0 120 200" className="absolute -right-4 top-2 w-28 h-44 opacity-70">
          {/* Yellow kibble */}
          <ellipse cx="70" cy="40" rx="14" ry="9" fill="#F2A900" opacity="0.7" transform="rotate(25 70 40)" />
          <ellipse cx="90" cy="65" rx="12" ry="8" fill="#F2A900" opacity="0.6" transform="rotate(-20 90 65)" />
          {/* Orange flower */}
          <path d="M80 130 Q95 110 110 125 Q100 140 85 145 Q70 140 80 130Z" fill="#E65A1E" opacity="0.5" />
        </svg>
      </div>
      <div className="max-w-container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white/10 rounded-xl py-6 px-4"
            >
              <div className="mb-3 w-16 h-16 relative">
                <Image
                  src={benefit.icon}
                  alt={benefit.text}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <p className="text-white font-semibold text-[16px] leading-tight">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
