"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/LangProvider";

export default function DogChatbot() {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if current path is an admin route
    if (pathname?.startsWith('/admin')) {
      setIsAdminRoute(true);
      return;
    }
    setIsAdminRoute(false);
  }, [pathname]);

  useEffect(() => {
    // Don't show animations if on admin route
    if (isAdminRoute) return;
    
    // Appear after a short delay
    const t1 = setTimeout(() => setVisible(true), 1200);
    // Show speech bubble after dog appears
    const t2 = setTimeout(() => setBubbleVisible(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isAdminRoute]);

  // Don't render on admin routes
  if (isAdminRoute) return null;

  return (
    <div
      data-chatbot
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-30 flex flex-col items-end gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Speech bubble */}
      <div
        style={{
          opacity: bubbleVisible ? 1 : 0,
          transform: bubbleVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          transformOrigin: 'bottom right',
        }}
        className="relative bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-100 mr-2"
      >
        <p
          className="text-deep-green font-bold text-[15px] whitespace-nowrap"
          style={{ fontFamily: "'TR Frankfurter', 'Rubik', sans-serif" }}
        >
          {t("chatbot.bubble.greeting")}
        </p>
        <p className="text-deep-green/60 text-[11px] font-rubik">{t("chatbot.bubble.subtext")}</p>
        {/* Tail pointing down-right */}
        <div
          className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100"
          style={{ transform: 'rotate(45deg)' }}
        />
      </div>

      {/* Dog button */}
      <button
        onClick={() => router.push("/matches")}
        aria-label="Find pet matches"
        className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white hover:scale-110 active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #F2A900 0%, #e09400 100%)',
          animation: 'dogBounce 2.5s ease-in-out infinite',
        }}
      >
        {/* Dog face photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/WhatsApp_Image_2026-04-11_at_09.54.12-removebg-preview.png"
          alt="Jeko dog"
          className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
        />
      </button>

      <style>{`
        @keyframes dogBounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
