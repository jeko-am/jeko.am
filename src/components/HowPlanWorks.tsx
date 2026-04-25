"use client";

import Link from "next/link";
import Image from "next/image";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { useContentT } from "@/lib/i18n/useContentT";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HowPlanWorks({ content }: { content?: any }) {
  const { ct, t } = useContentT(content);
  const heading = ct("heading", "home.howPlan.heading").replace(/\bPure\b/gi, "Jeko");
  const stepLabel = t("home.howPlan.stepLabel");
  const step1Title = ct("step_1_title", "home.howPlan.step1Title");
  const step1Description = ct("step_1_description", "home.howPlan.step1Title");
  const step2Title = ct("step_2_title", "home.howPlan.step2Title");
  const step2Description = ct("step_2_description", "home.howPlan.step2Title");
  const step3Title = ct("step_3_title", "home.howPlan.step3Title");
  const step3Description = ct("step_3_description", "home.howPlan.step3Title");
  const step4Title = t("home.howPlan.step4Title");
  const buttonText = ct("button_text", "home.howPlan.buttonText");
  const signupUrl = useSignupUrl();
  const buttonUrl = content?.button_url ?? signupUrl;

  const dynamicSteps = [
    {
      step: `${stepLabel} 1`,
      title: step1Title,
      description: step1Description,
      icon: "https://www.purepetfood.com/_next/static/media/add-dog-yellow.d420b8ed.png",
    },
    {
      step: `${stepLabel} 2`,
      title: step2Title,
      description: step2Description,
      icon: "https://www.purepetfood.com/_next/static/media/naturally-tasty.90dfdb2e.png",
    },
    {
      step: `${stepLabel} 3`,
      title: step3Title,
      description: step3Description,
      icon: "https://www.purepetfood.com/_next/static/media/free-delivery-truck.6102579b.png",
    },
    {
      step: `${stepLabel} 4`,
      title: step4Title,
      description: step4Title,
      icon: "https://www.purepetfood.com/_next/static/media/bowl-with-yellow-scoop.5cef6df6.png",
    },
  ];

  return (
    <section className="bg-deep-green py-16 pb-20 zigzag-bottom relative z-[1]">
      {/* Decorative elements - right side */}
      <div className="absolute right-0 top-0 h-full pointer-events-none hidden md:block overflow-hidden">
        <svg viewBox="0 0 180 400" className="absolute right-0 top-0 w-44 h-full opacity-80">
          {/* Orange splash top right */}
          <path d="M140 30 Q160 10 175 35 Q165 55 145 50 Q130 45 140 30Z" fill="#E65A1E" opacity="0.7" />
          <path d="M150 60 Q170 50 180 70 Q170 85 155 75 Q145 70 150 60Z" fill="#E65A1E" opacity="0.5" />
          {/* Green leaves mid-right */}
          <ellipse cx="155" cy="180" rx="22" ry="50" fill="#6B8E3A" opacity="0.4" transform="rotate(-10 155 180)" />
          <ellipse cx="140" cy="220" rx="18" ry="40" fill="#6B8E3A" opacity="0.35" transform="rotate(15 140 220)" />
          {/* Yellow shape */}
          <ellipse cx="160" cy="300" rx="14" ry="10" fill="#F2A900" opacity="0.6" transform="rotate(30 160 300)" />
        </svg>
      </div>
      {/* Decorative elements - left side */}
      <div className="absolute left-0 top-0 h-full pointer-events-none hidden md:block overflow-hidden">
        <svg viewBox="0 0 120 400" className="absolute left-0 top-0 w-28 h-full opacity-80">
          {/* Orange/pink splash */}
          <path d="M-10 280 Q10 260 30 275 Q20 295 5 300 Q-10 295 -10 280Z" fill="#E88B7D" opacity="0.5" />
          {/* Small yellow kibble */}
          <ellipse cx="30" cy="100" rx="10" ry="7" fill="#F2A900" opacity="0.5" transform="rotate(-25 30 100)" />
          <ellipse cx="15" cy="130" rx="8" ry="6" fill="#F2A900" opacity="0.4" transform="rotate(15 15 130)" />
        </svg>
      </div>
      <div className="max-w-container mx-auto px-6 relative z-10">
        <h2 className="text-[36px] md:text-[40px] font-medium text-white text-center tracking-wide mb-12">
          {heading}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {dynamicSteps.map((step, index) => (
            <div
              key={index}
              className="bg-deep-green border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4 w-14 h-14 relative">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <p className="text-gold font-medium text-[14px] mb-1">{step.step}</p>
              <p className="text-white font-medium text-[16px] leading-tight tracking-wide">
                {step.title}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={buttonUrl}
            className="inline-block bg-gold text-deep-green px-8 py-3.5 rounded-[5px] font-semibold text-[18px] hover:bg-[#d99500] transition-colors duration-300"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
