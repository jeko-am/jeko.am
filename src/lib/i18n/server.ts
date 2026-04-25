import { cookies } from "next/headers";
import { dictionaries } from "./translations";
import type { Dict, Lang } from "./types";
import { LANG_COOKIE } from "./types";

/**
 * Server-side language resolver. Usable from server components and route handlers.
 */
export async function getServerLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const v = store.get(LANG_COOKIE)?.value;
    return v === "hy" ? "hy" : "en";
  } catch {
    return "en";
  }
}

export async function getServerT() {
  const lang = await getServerLang();
  const dict: Dict = dictionaries[lang];
  const t = (key: string, vars?: Record<string, string | number>) => {
    const raw = dict[key] ?? dictionaries.en[key] ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_m, k) => (k in vars ? String(vars[k]) : `{${k}}`));
  };
  return { lang, t };
}
