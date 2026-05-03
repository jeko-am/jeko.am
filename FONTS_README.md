# Custom Fonts + Armenian Font Support — Implementation Notes

This document is a working tracker for the custom-fonts feature so anyone (including a future Claude session) can pick up where we left off without re-deriving context.

## Problem

The store editor exposes a font dropdown for every text/textarea field. The dropdown lists 12 Latin-only fonts (`Fredoka`, `Frankfurter`, `VAG Rounded`, etc.). When the editor is in Armenian (`hy`) mode, those fonts are still shown — but since none of them ship Armenian glyphs, picking one silently breaks Armenian rendering: the browser falls back to whatever the OS supplies for the Armenian Unicode block (U+0530–U+058F), which often looks nothing like the chosen font.

## What this feature delivers

1. **Honest dropdown in HY mode.** When `editLang === 'hy'`, the dropdown shows only fonts marked `supportsArmenian: true`.
2. **Warning modal** the first time an admin opens the font dropdown in HY mode per session.
3. **Custom font upload** at `/admin/store-editor/fonts` — admins can upload `.ttf/.otf/.woff/.woff2` files, label them, and tag whether the font supports Latin / Armenian / both.
4. **Runtime font loading.** A `CustomFontsBootstrap` component fetches uploaded fonts on every page load, injects `@font-face` rules, and adds them to the dropdown.
5. **Per-language font choice.** Admin can pick a Latin font for English text and a separate Armenian font for the same field, stored as `${fieldKey}_font_family` (EN) and `${fieldKey}_font_family_hy` (HY).

## Files touched

| File | Change |
|---|---|
| `src/lib/font-options.ts` | Added `supportsArmenian`/`supportsLatin` flags, runtime custom-font registry, `useFontOptions()` hook, `fontFamilyForLang()` resolver |
| `src/components/CustomFontsBootstrap.tsx` | **NEW** — loads custom_fonts on mount, injects @font-face, populates registry |
| `src/app/layout.tsx` | Mounts `<CustomFontsBootstrap />` |
| `src/app/admin/store-editor/page.tsx` | `FontFamilyControl` now accepts `lang`; filters HY-safe fonts; first-time HY warning modal; saves under `_font_family` (EN) or `_font_family_hy` (HY) |
| `src/app/admin/store-editor/fonts/page.tsx` | **NEW** — upload + list + delete admin UI |
| Render-time consumers of `fontFamilyFor(...)` | Switched to `fontFamilyForLang(value, lang, customFonts)` so HY pages pick the HY font |

## Supabase

> ✅ **Applied 2026-05-04** to project `dzhtpnskezkrtfinntbi` via the Supabase Management API. SQL is also checked in at `supabase/migrations/20260504_custom_fonts.sql` for re-application against new environments.

### Table: `custom_fonts`

```sql
create table public.custom_fonts (
  id uuid primary key default gen_random_uuid(),
  label text not null,                -- "Mariam Web", shown in dropdown
  value text not null unique,         -- "mariam-web", persisted in editor
  family text not null,               -- CSS font-family name, e.g. "Mariam Web"
  file_url text not null,             -- public URL of the font file
  supports_latin boolean default true,
  supports_armenian boolean default false,
  font_weight text default '400',
  font_style text default 'normal',
  format text,                        -- woff2, woff, truetype, opentype
  created_at timestamptz default now()
);
```

RLS: public read (anyone), authenticated insert/update/delete via the admin UI.

### Storage bucket: `custom-fonts`

Public bucket. Uploads go to `custom-fonts/<value>.<ext>`. Mime types: `font/woff2`, `font/woff`, `font/ttf`, `font/otf`.

## Component contracts

### `CustomFontsBootstrap`

```tsx
// src/components/CustomFontsBootstrap.tsx
"use client";
// On mount:
// 1. SELECT * FROM custom_fonts
// 2. For each row, append <style>@font-face { font-family: '${family}'; src: url('${file_url}') format('${format}'); font-weight: ${font_weight}; font-style: ${font_style}; }</style>
// 3. Call setCustomFonts(rows) so useFontOptions() picks them up
// Returns null.
```

### `useFontOptions()`

```ts
// src/lib/font-options.ts
const builtIns: FontOption[] = [...];   // existing 12 + new flags
let customFonts: FontOption[] = [];      // populated by CustomFontsBootstrap
const subscribers = new Set<() => void>();
export function setCustomFonts(rows: CustomFontRow[]) {
  customFonts = rows.map(toFontOption);
  subscribers.forEach(cb => cb());
}
export function useFontOptions(): FontOption[] {
  return useSyncExternalStore(subscribe, () => [...builtIns, ...customFonts], () => builtIns);
}
```

### `fontFamilyForLang(value, lang, options)`

Picks the right CSS font-family stack. Falls back to built-in Latin stack if HY value missing.

## Built-in Armenian-safe fonts

Only the OS-fallback options:
- `system` → system-ui (modern OSes have Armenian)
- `arial` → Mac/Windows Arial Armenian fallback
- `helvetica` → same as Arial on most systems

All other built-ins → `supportsArmenian: false`.

## Testing checklist

- [ ] `npx tsc --noEmit` passes
- [ ] Upload a font at `/admin/store-editor/fonts`
- [ ] New font shows in dropdown
- [ ] In EN mode all fonts visible; in HY mode only `supports_armenian` ones
- [ ] First HY dropdown open in a session shows the warning modal
- [ ] Picking a HY font and saving stores under `_font_family_hy`
- [ ] Switching back to EN reveals the original EN font choice intact
- [ ] Live homepage in `?lang=hy` renders Armenian text in the chosen Armenian font

## Migration notes for existing data

No backfill needed. Existing rows keep their `_font_family` keys (treated as EN). HY mode starts blank for every field; admins set Armenian fonts going forward.
