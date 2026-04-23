"use client";

import { useEffect, useState } from "react";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function setGoogTransCookie(lang: string) {
  const domain = window.location.hostname; // e.g. www.jeko.am
  const rootDomain = domain.replace(/^www\./, ""); // e.g. jeko.am

  if (lang === "en") {
    const past = "Thu, 01 Jan 1970 00:00:00 GMT";
    // Clear every domain variant Google Translate could have used
    for (const d of [domain, `.${domain}`, rootDomain, `.${rootDomain}`]) {
      document.cookie = `googtrans=;path=/;domain=${d};expires=${past}`;
    }
    document.cookie = `googtrans=;path=/;expires=${past}`;
    // Hard-navigate so the page loads fresh outside any translate proxy
    window.location.href = window.location.href.split("?")[0];
  } else {
    const value = `/en/${lang}`;
    document.cookie = `googtrans=${value};path=/;domain=${domain}`;
    document.cookie = `googtrans=${value};path=/;domain=.${rootDomain}`;
    document.cookie = `googtrans=${value};path=/`;
    window.location.reload();
  }
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hy", label: "Armenian", flag: "🇦🇲" },
] as const;

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<"en" | "hy">("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cookie = getCookie("googtrans");
    if (cookie && cookie.includes("/hy")) setCurrentLang("hy");
    else setCurrentLang("en");

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "hy,en", autoDisplay: false },
          "gt_hidden_element"
        );
      }
    };
    if (!document.querySelector("#gt-script")) {
      const s = document.createElement("script");
      s.id = "gt-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const active = languages.find((l) => l.code === currentLang)!;

  return (
    <>
      <div id="gt_hidden_element" className="hidden" />

      <div className="relative z-50">
        <button
          onClick={() => setOpen((o) => !o)}
          onTouchEnd={(e) => { e.preventDefault(); setOpen((o) => !o); }}
          className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-[15px] font-rubik font-medium text-white hover:bg-white/20 transition-all duration-200 notranslate cursor-pointer active:bg-white/30"
          aria-label="Switch language"
          translate="no"
        >
          <span className="text-base leading-none">{active.flag}</span>
          <span translate="no">{active.code.toUpperCase()}</span>
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
            {/* Click-away overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden min-w-[150px] z-[60]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setOpen(false);
                    if (lang.code !== currentLang) setGoogTransCookie(lang.code);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    if (lang.code !== currentLang) setGoogTransCookie(lang.code);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-rubik text-left transition-colors duration-150 notranslate cursor-pointer active:bg-gray-100 ${
                    lang.code === currentLang
                      ? "bg-deep-green/5 text-deep-green font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  translate="no"
                >
                  <span className="text-base">{lang.flag}</span>
                  <span translate="no">{lang.label}</span>
                  {lang.code === currentLang && (
                    <svg className="ml-auto w-3.5 h-3.5 text-deep-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
