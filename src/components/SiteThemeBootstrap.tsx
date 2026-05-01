'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Reads the global site text-colour from app_settings.site_theme and applies
 * it to the public site (skipped on /admin routes). Writes the colour into a
 * CSS custom property on <html> and toggles a data attribute on <body> so the
 * scoped overrides in globals.css take effect across every section.
 */
export default function SiteThemeBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin');
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'site_theme')
        .maybeSingle();

      if (cancelled) return;

      const text = (data?.value as { text_color?: string } | null)?.text_color;

      if (!isAdmin && text && /^#[0-9a-fA-F]{6}$/.test(text)) {
        document.documentElement.style.setProperty('--site-text-color', text);
        document.body.setAttribute('data-site-text', '1');
      } else {
        document.documentElement.style.removeProperty('--site-text-color');
        document.body.removeAttribute('data-site-text');
      }
    })();

    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
