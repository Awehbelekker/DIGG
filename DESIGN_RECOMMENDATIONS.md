# Design Recommendations — Above the Industry for Architect Websites

Based on research into leading architecture firms (Gensler, Lake Flato, WilkinsonEyre, Morris Adjmi, FGM Architects) and current design trends for architecture and luxury brands.

---

## 1. Typography (Implemented)

- **Headings:** Use a **serif** (e.g. Playfair Display, Cormorant Garamond) for authority and elegance. Top firms use custom or premium serifs for headlines.
- **Body:** Use a **clean sans-serif** (e.g. DM Sans, Inter) for readability and a modern, disciplined feel. Avoid handwritten fonts for long copy on “above industry” sites.
- **Hierarchy:** Clear H1 → H2 → H3 with consistent scale and spacing so the page reads like a structured document.

---

## 2. Layout & Whitespace

- **Generous whitespace:** Let content breathe. Use consistent section padding (e.g. py-24 lg:py-32) and max-widths for text (e.g. max-w-3xl for body, max-w-5xl for section titles).
- **Project-first:** Leading sites put **projects/work** at the centre: large imagery, full-bleed heroes, and clear project narratives. Add a “Selected Work” or “Projects” section with high-quality images.
- **Restraint:** Fewer sections, each with one clear message. Avoid dense blocks of text; use short paragraphs and clear subheadings.

---

## 3. Imagery & Media

- **Quality:** Use high-resolution, well-composed photos (architecture, interiors, context). Avoid generic stock where possible.
- **Full-bleed:** Use edge-to-edge or full-width images for heroes and key project showcases.
- **Video:** Consider a short hero or project video; firms like WilkinsonEyre use video prominently.
- **Consistency:** Same aspect ratios and treatment (e.g. subtle shadows, borders, or no frame) across the site.

---

## 4. Color & Brand

- **Confident but restrained:** Limit to 2–3 colours (e.g. navy, orange, white/off-white). Use accent colour for CTAs and key highlights only.
- **Neutrals:** Soft greys and off-whites for backgrounds so work and type stand out. Your navy/orange palette fits this if used sparingly.
- **Contrast:** Ensure text meets WCAG AA (especially navy on white and white on navy).

---

## 5. Navigation & UX

- **Simple nav:** Fewer items or grouped under clear labels. Top sites often use minimal main nav (e.g. Work, About, Contact).
- **Contact prominence:** Make phone/email/contact form easy to find (e.g. in nav, footer, and after key sections).
- **Fast & responsive:** Optimise images (Next/Image), minimise heavy scripts, and test on mobile. Speed and clarity signal professionalism.

---

## 6. Content & Storytelling

- **“Thinking” / insights:** A short blog, case studies, or “Insights” section positions you as experts (e.g. Gensler, WilkinsonEyre).
- **Project storytelling:** For each project: context → approach → outcome (and images). Even 3–5 strong projects can be enough.
- **Proof:** Credentials, awards, and client types (without naming if confidential) build trust.

---

## 7. Subtle Motion & Polish

- **Scroll reveals:** Light fade-in or slide-up as sections enter view (with `prefers-reduced-motion` respected).
- **Hover states:** Consistent, subtle hovers on cards and buttons (e.g. lift, shadow, or colour shift).
- **No clutter:** Avoid auto-playing carousels, too many animations, or decorative elements that don’t support content.

---

## 8. Technical & SEO

- **Semantic HTML:** Use `<section>`, `<article>`, headings in order, and landmarks so structure is clear for accessibility and SEO.
- **Meta & Open Graph:** Strong titles and descriptions per page; consider OG images for key pages.
- **Performance:** Lazy-load below-the-fold images; keep critical CSS and fonts minimal.

---

## Summary: What “Above Industry” Looks Like

| Area            | Typical architect site     | Above industry (DIGG aim)                    |
|-----------------|----------------------------|----------------------------------------------|
| Typography      | Generic system fonts       | Serif + sans pairing, clear hierarchy        |
| Layout          | Dense, many sections       | Spacious, project-led, one idea per section  |
| Imagery         | Small, mixed quality       | Large, consistent, high-quality              |
| Color           | Many accents               | 2–3 colours, used with restraint             |
| Navigation      | Long menus                 | Short, clear, contact obvious                |
| Motion          | None or gimmicky           | Subtle scroll/hover, reduced-motion friendly |
| Content         | Brochure-style             | Storytelling + expertise (e.g. insights)     |

---

## Implemented in This Project

- **Typography:** Playfair Display (headings) + DM Sans (body) for a premium, readable system.
- **Selected Work:** Placeholder section on the homepage ready for project images and links.
- **Scroll reveal:** Light fade-in on key sections, disabled when `prefers-reduced-motion` is set.
- **Spacing & hierarchy:** Consistent section padding and heading styles.

## Next Steps (When You’re Ready)

1. Add 3–5 real project photos and short case studies to “Selected Work.”
2. Replace hero background with a strong project or location image (full-bleed).
3. Consider an “Insights” or “Thinking” page (e.g. 2–3 short articles or case summaries).
4. Audit all imagery for resolution and consistency; use Next.js `Image` with sensible sizes.
5. Add a favicon and OG image for sharing.
