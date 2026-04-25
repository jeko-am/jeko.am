"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries } from "./translations";
import type { Dict, Lang } from "./types";
import { LANG_COOKIE } from "./types";

type Ctx = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<Ctx | null>(null);

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const domain = window.location.hostname.replace(/^www\./, "");
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value};path=/;domain=${domain};expires=${expiry}`;
  document.cookie = `${name}=${value};path=/;expires=${expiry}`;
}

/**
 * Applies template vars like "Hello {name}" -> "Hello Alice".
 */
function format(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_m, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/**
 * DB-override layer. The store editor writes to /admin/store-editor → updates
 * the `translations` table in Supabase. We merge those overrides on top of the
 * static dictionary at runtime.
 */
const runtimeOverrides: Record<Lang, Dict> = { en: {}, hy: {} };

export function applyOverrides(lang: Lang, overrides: Dict) {
  runtimeOverrides[lang] = { ...runtimeOverrides[lang], ...overrides };
}

export function LangProvider({
  initialLang = "en",
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // URL ?lang=hy wins over cookie — used by admin store-editor iframe preview
    let urlLang: Lang | null = null;
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "hy" || q === "en") urlLang = q;
    }
    const cookieLang = readCookie(LANG_COOKIE);
    const next: Lang | null =
      urlLang ?? (cookieLang === "hy" || cookieLang === "en" ? cookieLang : null);
    if (next && next !== lang) setLangState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    writeCookie(LANG_COOKIE, next);
    setLangState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[lang];
      const override = runtimeOverrides[lang]?.[key];
      const raw = override ?? dict[key] ?? dictionaries.en[key] ?? key;
      return format(raw, vars);
    },
    [lang]
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Fallback so components outside the provider don't crash during SSR.
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: string, vars?: Record<string, string | number>) =>
        format(dictionaries.en[key] ?? key, vars),
    };
  }
  return ctx;
}

export function useLang() {
  return useT().lang;
}
