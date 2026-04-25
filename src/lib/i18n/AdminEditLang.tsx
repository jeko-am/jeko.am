"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang } from "./types";

const STORAGE_KEY = "jeko-admin-edit-lang";

type Ctx = {
  editLang: Lang;
  setEditLang: (l: Lang) => void;
};

const AdminEditLangContext = createContext<Ctx | null>(null);

export function AdminEditLangProvider({ children }: { children: React.ReactNode }) {
  const [editLang, setEditLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "hy") setEditLangState(saved);
  }, []);

  const setEditLang = useCallback((l: Lang) => {
    setEditLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
    // Let other components on the page react without a React context listener.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("admin-edit-lang-changed", { detail: l }));
    }
  }, []);

  return (
    <AdminEditLangContext.Provider value={{ editLang, setEditLang }}>
      {children}
    </AdminEditLangContext.Provider>
  );
}

export function useAdminEditLang(): Ctx {
  const ctx = useContext(AdminEditLangContext);
  if (!ctx) {
    // Graceful fallback for components rendered outside admin layout.
    return {
      editLang: "en",
      setEditLang: () => {},
    };
  }
  return ctx;
}

/**
 * Read the current admin edit language directly from storage — useful for
 * components initializing local state before context is available.
 */
export function getAdminEditLangSync(): Lang {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "hy" ? "hy" : "en";
}
