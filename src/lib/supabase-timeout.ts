import { createClient } from "@supabase/supabase-js";

export function fetchWithTimeout(timeoutMs: number): typeof fetch {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}

export function createSupabaseClientWithTimeout(
  url: string,
  anonKey: string,
  timeoutMs = 3000
) {
  return createClient(url, anonKey, {
    global: {
      fetch: fetchWithTimeout(timeoutMs),
    },
  });
}
