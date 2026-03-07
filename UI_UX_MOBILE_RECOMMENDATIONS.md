# UI, UX & Mobile — What’s Done & Recommendations

Quick reference for what’s already in place and what to do next for a polished, mobile-optimized site.

---

## Implemented (current polish)

### Accessibility
- **Skip to main content** — Keyboard users get a skip link (visible on focus) that jumps to `#main-content`.
- **Focus rings** — `:focus-visible` uses orange outline; skip link and key buttons have clear focus styles.
- **Semantic structure** — `<main id="main-content">`, landmarks, heading hierarchy.

### Mobile & touch
- **Viewport** — `device-width`, `initialScale=1`, `maximumScale=5`, `themeColor: #1B2A6B`.
- **Tap highlight** — `-webkit-tap-highlight-color: transparent` for cleaner touch feedback.
- **Touch targets** — Nav links (including mobile menu) and footer links use `min-h-[44px]`; hamburger and WhatsApp button are at least 44–56px.
- **Safe area** — WhatsApp button uses `env(safe-area-inset-bottom/right)` so it stays clear of notches and home indicators.
- **Mobile menu** — Closes automatically on route change (no stuck open menu after navigation).

### Forms
- **Input font size** — Contact and Agent forms use `text-base` (16px) on inputs to avoid iOS zoom on focus.
- **Form padding** — `p-6 sm:p-8` so forms aren’t cramped on small screens.

### Layout & typography
- **Hero** — `min-h-[70vh]` on mobile, `80vh` on larger screens; responsive title and subtitle sizes; CTA buttons with `min-h-[48px]`.
- **Sections** — Responsive padding (e.g. `py-14 sm:py-20 lg:py-28`) and heading sizes on homepage.
- **Reduced motion** — Scroll-reveal respects `prefers-reduced-motion`.

---

## Recommendations (next steps)

### High impact
1. **Test on real devices** — Check iPhone (Safari), Android (Chrome), and one tablet; confirm nav, forms, and WhatsApp button.
2. **Lighthouse** — Run in Chrome DevTools (Performance, Accessibility, Best Practices). Fix any critical issues.
3. **Images** — Use Next.js `Image` with `sizes` where possible; keep hero and Selected Work images under ~200 KB and well compressed.

### UX polish (implemented)
4. **Loading states** — `app/[slug]/loading.tsx` shows a spinner and “Loading page…” while dynamic CMS pages load.
5. **Form feedback** — Contact and Agent forms: submit is disabled while loading; inline email validation (format) with error message and `aria-invalid` / `aria-describedby`.
6. **404** — Custom 404 has a minimal header with “DIGG Architecture” and “Home” link so it feels part of the site; touch-friendly buttons.

### Mobile-specific (implemented)
7. **Horizontal scroll** — `overflow-x: hidden` on `body` to prevent horizontal scroll on narrow viewports.
8. **Sticky nav height** — Navbar uses responsive height: `h-16` (mobile), `sm:h-20`, `lg:h-24` so it’s shorter on small viewports.
9. **Orientation** — Test landscape on phone; adjust hero min-height or padding if content feels cut off.

### Performance
10. **Fonts** — Montserrat and Lato are loaded via `next/font`; already optimized. If you add many custom fonts from Settings, watch total font payload.
11. **Third-party** — If you add analytics or chat widgets, load them async and consider `fetchpriority="low"` or lazy load below the fold.

### Content & trust (partially implemented)
12. **Trust signals** — Footer includes a short trust line: “Cape Town architecture & property design — income-generating solutions.”
13. **Contact visibility** — Phone number in nav or hero on mobile can increase conversions (optional).

---

## Checklist (before launch)

- [ ] Skip link works (Tab from top, Enter to jump).
- [ ] All interactive elements keyboard-focusable and visible focus.
- [ ] Mobile menu opens/closes and closes on route change.
- [x] Forms: submit has loading state and inline email validation; iOS zoom avoided via text-base.
- [ ] WhatsApp button not covered by notch or home indicator.
- [x] No horizontal scroll on 320px width (body overflow-x: hidden).
- [ ] Lighthouse Accessibility ≥ 90; Performance acceptable for your target devices.
- [ ] Test one screen reader (e.g. VoiceOver) on one key flow (e.g. “Contact”).

Use this doc as a living checklist; update the “Implemented” section when you add more polish.
