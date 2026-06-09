type Content = Record<string, unknown> | null | undefined;

function own(content: Content, key: string): boolean {
  return !!content && Object.prototype.hasOwnProperty.call(content, key);
}

export function contentText(content: Content, key: string, fallback = ""): string {
  if (own(content, key)) {
    const value = content?.[key];
    return typeof value === "string" ? value : value == null ? "" : String(value);
  }
  return fallback;
}

export function localizedContentText(content: Content, key: string, lang: string, fallback = ""): string {
  if (lang === "hy") {
    const hy = content?.hy;
    if (hy && typeof hy === "object" && Object.prototype.hasOwnProperty.call(hy, key)) {
      const value = (hy as Record<string, unknown>)[key];
      return typeof value === "string" ? value : value == null ? "" : String(value);
    }
  }
  return contentText(content, key, fallback);
}

export function contentUrl(content: Content, key: string, fallback = ""): string {
  return normalizeContentUrl(contentText(content, key, fallback));
}

export function normalizeContentUrl(url: unknown, fallback = ""): string {
  const value = typeof url === "string" ? url.trim() : "";
  const next = value || fallback;
  if (next === "/signup" || next === "signup") return "/auth/signup";
  if (next.startsWith("/signup?")) return `/auth/signup${next.slice("/signup".length)}`;
  if (next.startsWith("/signup#")) return `/auth/signup${next.slice("/signup".length)}`;
  return next;
}
