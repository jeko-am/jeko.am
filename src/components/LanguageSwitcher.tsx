"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/LangProvider";
import type { Lang } from "@/lib/i18n/types";

const languages: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const active = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-[15px] font-rubik font-medium text-white hover:bg-white/20 transition-all duration-200 cursor-pointer active:bg-white/30"
        aria-label="Switch language"
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span>{active.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden min-w-[150px] z-[60]">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setOpen(false);
                  if (l.code !== lang) setLang(l.code);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  if (l.code !== lang) setLang(l.code);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-rubik text-left transition-colors duration-150 cursor-pointer active:bg-gray-100 ${
                  l.code === lang
                    ? "bg-deep-green/5 text-deep-green font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
                {l.code === lang && (
                  <svg
                    className="ml-auto w-3.5 h-3.5 text-deep-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
