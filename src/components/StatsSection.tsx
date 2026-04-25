"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StatsSection({ content }: { content?: any }) {
  const { ct } = useContentT(content);
  const mealsServed = content?.meals_served ?? 92905251;
  const stat1Value = ct("stat_1_value", "home.stats.stat1Value");
  const stat1Label = ct("stat_1_label", "home.stats.stat1Label");
  const stat2Value = ct("stat_2_value", "home.stats.stat2Value");
  const stat2Label = ct("stat_2_label", "home.stats.stat2Label");

  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const startAnimation = useCallback(() => {
    const end = mealsServed;
    const duration = 2500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
  }, [mealsServed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startAnimation();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, startAnimation]);

  return (
    <section ref={sectionRef} className="section-spacing bg-off-white relative overflow-hidden">
      {/* Decorative elements - right side */}
      <div className="absolute right-0 top-0 h-full pointer-events-none hidden md:block">
        <svg viewBox="0 0 160 400" className="absolute right-0 top-0 w-40 h-full">
          {/* Green leaf */}
          <ellipse cx="130" cy="80" rx="25" ry="50" fill="#274C46" opacity="0.15" transform="rotate(-20 130 80)" />
          <ellipse cx="145" cy="120" rx="20" ry="40" fill="#274C46" opacity="0.12" transform="rotate(10 145 120)" />
          {/* Orange splash */}
          <path d="M120 240 Q145 220 155 245 Q145 265 125 260 Q110 255 120 240Z" fill="#E65A1E" opacity="0.4" />
          {/* Yellow shapes */}
          <ellipse cx="140" cy="320" rx="12" ry="8" fill="#F2A900" opacity="0.5" transform="rotate(30 140 320)" />
        </svg>
      </div>
      {/* Decorative elements - left side */}
      <div className="absolute left-0 top-0 h-full pointer-events-none hidden md:block">
        <svg viewBox="0 0 120 400" className="absolute left-0 top-0 w-28 h-full">
          {/* Pink splash */}
          <path d="M-10 100 Q15 80 30 100 Q15 120 0 115 Q-10 110 -10 100Z" fill="#E88B7D" opacity="0.35" />
          {/* Purple circle */}
          <circle cx="30" cy="260" r="18" fill="#5F295E" opacity="0.2" />
        </svg>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-[36px] md:text-[40px] font-medium text-deep-green tracking-wide mb-4">
          {ct("heading", "home.stats.heading")}
        </h2>

        <div className="text-[48px] md:text-[64px] font-medium text-gold tracking-wide mb-4 leading-tight">
          {count.toLocaleString()}
        </div>

        <p className="text-[18px] text-deep-green max-w-xl mx-auto mb-10">
          {ct("meals_label", "home.stats.mealsLabel")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-beige-light rounded-xl p-6 flex items-center gap-4">
            <span className="text-[42px] md:text-[48px] font-medium text-gold tracking-wide shrink-0">
              {stat1Value}
            </span>
            <p className="text-left text-[16px] font-semibold text-deep-green leading-snug">
              {stat1Label}
            </p>
          </div>

          <div className="bg-beige-light rounded-xl p-6 flex items-center gap-4">
            <span className="text-[42px] md:text-[48px] font-medium text-gold tracking-wide shrink-0">
              {stat2Value}
            </span>
            <p className="text-left text-[16px] font-semibold text-deep-green leading-snug">
              {stat2Label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
