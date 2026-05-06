"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/LangProvider";
import { supabase } from "@/lib/supabase";

export type ChatbotContent = {
  enabled?: boolean;
  icon_image?: string;
  link_url?: string;
  aria_label?: string;
  bubble_enabled?: boolean;
  bubble_greeting?: string;
  bubble_subtext?: string;
  counter_enabled?: boolean;
  counter_label?: string;
  background_color?: string;
};

export default function DogChatbot({ content }: { content?: ChatbotContent }) {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  const iconSrc = content?.icon_image || "/WhatsApp_Image_2026-04-11_at_09.54.12-removebg-preview.png";
  const linkUrl = content?.link_url || "/matches";
  const ariaLabel = content?.aria_label || "Find pet matches";
  const bubbleEnabled = content?.bubble_enabled !== false;
  const counterEnabled = content?.counter_enabled !== false;
  const bgColor = content?.background_color || "#F2A900";
  const greeting = content?.bubble_greeting ?? t("chatbot.bubble.greeting");
  const subtext = content?.bubble_subtext ?? t("chatbot.bubble.subtext");
  const counterLabel = content?.counter_label ?? t("chatbot.counter.label") ?? "pets registered";
  const hasBubbleText = Boolean((greeting && greeting.trim()) || (subtext && subtext.trim()));

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('user_profiles')
      .select('user_id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (cancelled || error || count == null) return;
        setUserCount(count);
      });
    const channel = supabase
      .channel('chatbot-user-count-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_profiles' },
        () => { if (!cancelled) setUserCount(prev => (prev != null ? prev + 1 : prev)); }
      )
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, []);

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
      {bubbleEnabled && hasBubbleText && (
        <div
          style={{
            opacity: bubbleVisible ? 1 : 0,
            transform: bubbleVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            transformOrigin: 'bottom right',
          }}
          className="relative bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-100 mr-2"
        >
          {greeting && greeting.trim() && (
            <p
              className="text-deep-green font-bold text-[15px] whitespace-nowrap"
              style={{ fontFamily: "'TR Frankfurter', 'Rubik', sans-serif" }}
            >
              {greeting}
            </p>
          )}
          {subtext && subtext.trim() && (
            <p className="text-deep-green/60 text-[11px] font-rubik">{subtext}</p>
          )}
          {/* Tail pointing down-right */}
          <div
            className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100"
            style={{ transform: 'rotate(45deg)' }}
          />
        </div>
      )}

      {/* Dog button */}
      <button
        onClick={() => router.push(linkUrl)}
        aria-label={ariaLabel}
        className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white hover:scale-110 active:scale-95 transition-transform"
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`,
          animation: 'dogBounce 2.5s ease-in-out infinite',
        }}
      >
        {/* Dog face photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt="Chatbot icon"
          className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
        />
      </button>

      {/* Live registered-pets counter */}
      {counterEnabled && userCount != null && (
        <div className="bg-white rounded-full shadow-lg border border-blue-200 px-3 py-1.5 flex items-center gap-1.5 mt-1">
          <span aria-hidden="true">🐾</span>
          <span className="font-mono font-bold text-blue-600 text-[15px] tabular-nums tracking-wider">
            {String(userCount).padStart(4, '0')}
          </span>
          <span className="text-deep-green/70 text-[10px] font-semibold whitespace-nowrap">
            {counterLabel}
          </span>
        </div>
      )}

      <style>{`
        @keyframes dogBounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
