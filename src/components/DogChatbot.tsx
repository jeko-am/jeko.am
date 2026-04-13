"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DogChatbot() {
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
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 flex flex-col items-end gap-2"
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
          Bow Wow! 🐾
        </p>
        <p className="text-deep-green/60 text-[11px] font-rubik">Find a friend for your pup!</p>
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
        {/* Dog SVG face */}
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 lg:w-16 lg:h-16">
          {/* Left ear */}
          <ellipse cx="22" cy="36" rx="14" ry="20" fill="#8B5E3C" transform="rotate(-15 22 36)" />
          <ellipse cx="22" cy="36" rx="9" ry="15" fill="#c48a5c" transform="rotate(-15 22 36)" />
          {/* Right ear */}
          <ellipse cx="78" cy="36" rx="14" ry="20" fill="#8B5E3C" transform="rotate(15 78 36)" />
          <ellipse cx="78" cy="36" rx="9" ry="15" fill="#c48a5c" transform="rotate(15 78 36)" />
          {/* Head */}
          <ellipse cx="50" cy="52" rx="33" ry="30" fill="#c48a5c" />
          {/* Forehead patch */}
          <ellipse cx="50" cy="38" rx="18" ry="12" fill="#8B5E3C" />
          {/* Left eye white */}
          <circle cx="37" cy="48" r="8" fill="white" />
          {/* Right eye white */}
          <circle cx="63" cy="48" r="8" fill="white" />
          {/* Left eye */}
          <circle cx="38" cy="49" r="5" fill="#2d1a0e" />
          {/* Right eye */}
          <circle cx="64" cy="49" r="5" fill="#2d1a0e" />
          {/* Left eye shine */}
          <circle cx="40" cy="47" r="2" fill="white" />
          {/* Right eye shine */}
          <circle cx="66" cy="47" r="2" fill="white" />
          {/* Muzzle */}
          <ellipse cx="50" cy="66" rx="18" ry="13" fill="#f0b990" />
          {/* Nose */}
          <ellipse cx="50" cy="60" rx="7" ry="5" fill="#2d1a0e" />
          <ellipse cx="48" cy="58.5" rx="2.5" ry="1.5" fill="#5a3a2a" />
          {/* Mouth */}
          <path d="M50 65 Q44 71 40 68" stroke="#2d1a0e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M50 65 Q56 71 60 68" stroke="#2d1a0e" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Tongue */}
          <ellipse cx="50" cy="73" rx="6" ry="5" fill="#e05070" />
          <line x1="50" y1="69" x2="50" y2="74" stroke="#c03050" strokeWidth="1.5" />
        </svg>
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
