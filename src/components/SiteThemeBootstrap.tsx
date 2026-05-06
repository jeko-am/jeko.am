'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Reads global theme colors from app_settings.site_theme and writes them to
 * CSS variables on <html>. Tailwind reads these variables (see tailwind.config
 * + globals.css :root) so brand color edits in /admin/store-editor/theme take
 * effect everywhere instantly without a rebuild.
 *
 * Supported keys in app_settings.site_theme value JSON:
 *   - text_color   → --site-text-color
 *   - deep_green   → --deep-green   + --deep-green-rgb
 *   - off_white    → --off-white    + --off-white-rgb
 *   - gold         → --gold         + --gold-rgb
 *   - gold_hover   → --gold-hover
 *   - orange_brand → --orange-brand + --orange-brand-rgb
 *   - purple_brand → --purple-brand + --purple-brand-rgb
 *   - beige_light  → --beige-light  + --beige-light-rgb
 */

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

function hexToRgbTriplet(hex: string): string | null {
  if (!HEX_RE.test(hex)) return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function applyColor(varName: string, hex: string | undefined) {
  const root = document.documentElement;
  if (hex && HEX_RE.test(hex)) {
    root.style.setProperty(`--${varName}`, hex);
    const triplet = hexToRgbTriplet(hex);
    if (triplet) root.style.setProperty(`--${varName}-rgb`, triplet);
  } else {
    root.style.removeProperty(`--${varName}`);
    root.style.removeProperty(`--${varName}-rgb`);
  }
}

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

      const theme = (data?.value || {}) as Record<string, string | undefined>;

      // Site text color (legacy, scoped to public site only)
      const text = theme.text_color;
      if (!isAdmin && text && HEX_RE.test(text)) {
        document.documentElement.style.setProperty('--site-text-color', text);
        document.body.setAttribute('data-site-text', '1');
      } else {
        document.documentElement.style.removeProperty('--site-text-color');
        document.body.removeAttribute('data-site-text');
      }

      // Brand colors apply globally (admin sees the brand too).
      applyColor('deep-green',   theme.deep_green);
      applyColor('off-white',    theme.off_white);
      applyColor('gold',         theme.gold);
      applyColor('orange-brand', theme.orange_brand);
      applyColor('purple-brand', theme.purple_brand);
      applyColor('beige-light',  theme.beige_light);

      // gold-hover has no rgb triplet (only used as a flat bg color)
      const hover = theme.gold_hover;
      if (hover && HEX_RE.test(hover)) {
        document.documentElement.style.setProperty('--gold-hover', hover);
      } else {
        document.documentElement.style.removeProperty('--gold-hover');
      }
    })();

    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
