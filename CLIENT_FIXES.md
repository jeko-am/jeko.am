# Client Fixes — April 2026

Tracking the round of fixes requested by the client before site acceptance.

## Bugs

| # | Issue | File(s) | Status |
|---|-------|---------|--------|
| 1 | Mobile hero stretches the desktop image — needs separate mobile image upload (Shopify-style) | `src/components/HeroSection.tsx`, `src/app/admin/store-editor/schemas.ts` | Fixed |
| 2 | Section after "compare" renders garbled escapes (`“`, `”`) and "Dr Peter Wright" is hardcoded so the client can't edit it | `src/components/YorkshireVet.tsx`, `src/app/admin/store-editor/schemas.ts` | Fixed |

## Design

| # | Change | File(s) | Status |
|---|--------|---------|--------|
| 3 | Top hero heading: green → milky white | `src/components/HeroSection.tsx` | Fixed |
| 4 | Replace site fonts (current Frankfurter/Times feel) with a VAG Rounded Next Heavy-style face (using Fredoka as the closest free Google Font) | `src/app/globals.css`, `tailwind.config.ts` | Fixed |
| 5 | Add a playful (pill, not strict square) Sign Up CTA after the main hero | `src/app/page.tsx`, new `src/components/PlayfulSignupCTA.tsx` | Fixed |

## UX / Structure

| # | Change | File(s) | Status |
|---|--------|---------|--------|
| 6 | Let the client hide unwanted top-nav menu items from the store editor (no code edits needed) | `src/components/Header.tsx`, `src/app/admin/store-editor/schemas.ts` | Fixed |

## Notes for the client

- **Mobile hero image**: in the store editor → Homepage → Hero section, there is now a second image field labeled **"Hero Image (Mobile)"**. Upload a portrait/mobile-optimised image there. If left blank, the desktop image is used as the fallback.
- **Yorkshire Vet section**: the heading, author name, and quote are all editable from the store editor under Homepage → Yorkshire Vet. Setting any field to blank hides that line entirely.
- **Menu items**: each top-nav item now has a "Show in menu" toggle in the store editor under Homepage → Header. Turn off the ones you don't want visible.
- **Fonts**: VAG Rounded Next Heavy is a paid Monotype font and can't be loaded directly from Google Fonts. The site is currently using **Fredoka** (the closest free, rounded-heavy match). If you have a license for VAG Rounded, drop the `.ttf`/`.woff2` into `public/` and we'll point the `@font-face` at it.

## Files touched

- `src/app/globals.css`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/components/HeroSection.tsx`
- `src/components/YorkshireVet.tsx`
- `src/components/Header.tsx`
- `src/components/PlayfulSignupCTA.tsx` *(new)*
- `src/app/page.tsx`
- `src/app/admin/store-editor/schemas.ts`
