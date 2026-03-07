# DIGG Website CMS — Recommendations

A single list of **other recommendations** (product, UX, technical, content) now that the core CMS, visual page builder, logo options, and typography are in place.

---

## 1. Admin / CMS (quick wins)

| Recommendation | Why |
|----------------|-----|
| **Page delete & duplicate** | Delete with confirmation; duplicate page (slug `-copy`, draft) so admins can reuse layouts. |
| **Form submission detail view** | Open one submission at `/admin/forms/[id]` instead of only the list. |
| **Page preview** | “Preview” button that opens the public page (or draft) in a new tab. |
| **Selected Work: reorder** | Drag-and-drop or up/down buttons to order projects on the homepage. |
| **Settings: URL validation** | Optional check that hero/favicon/OG/Selected Work image URLs load; show a warning if they don’t. |
| **Form submissions: read/archive** | Mark as read; optional archive so the list stays manageable. |
| **Images: bulk actions** | Select multiple images → bulk delete or bulk set folder/alt. |
| **Insights / blog** | Content type (title, slug, excerpt, body, published). Admin CRUD; public `/insights` and `/insights/[slug]`. |
| **Multi-user roles** | Optional “editor” (content only) vs “admin” (settings, delete). |

---

## 2. Public site & UX

| Recommendation | Why |
|----------------|-----|
| **Mobile nav polish** | Ensure hamburger menu and tap targets are comfortable; consider closing on route change. |
| **Breadcrumbs** | On inner pages (e.g. CMS-built `/[slug]`) for orientation and SEO. |
| **Skip to content** | Link at top of page for keyboard/screen-reader users. |
| **404 page** | Custom 404 with site nav and a CTA (e.g. back home / contact). |
| **Loading / skeleton** | Skeleton or spinner for dynamic `/[slug]` while content loads. |

---

## 3. Design & content (from design research)

| Recommendation | Why |
|----------------|-----|
| **3–5 real project photos** | Populate Selected Work with real projects and short captions. |
| **Strong hero image** | Use Settings → Hero image for a full-bleed project or location shot. |
| **Favicon & OG image** | Already in Settings; set them for branding and social sharing. |
| **Consistent image treatment** | Same aspect ratios and style (e.g. subtle shadow or border) across sections. |
| **Video** | Optional hero or project video (e.g. short loop) for a more “above industry” feel. |
| **Insights / Thinking** | 2–3 short articles or case summaries to show expertise. |

---

## 4. Technical & performance

| Recommendation | Why |
|----------------|-----|
| **RLS for `pages`** | Already in `supabase/migrations/001_initial_schema.sql`: “Public can view published pages” (SELECT where `published = true`). No extra step needed. |
| **Image optimization** | Keep using Next `Image` (or optimized `<img>`) and sensible `sizes` for different breakpoints. |
| **Metadata per page** | Dynamic `/[slug]` already uses meta title/description; extend to OG image per page if you add one. |
| **Analytics** | Add a script or tag (e.g. GA4, Plausible) for traffic and behaviour. |
| **Error monitoring** | e.g. Sentry or Vercel logs to catch runtime errors in production. |
| **Staging env** | Optional separate Supabase project and Vercel preview for testing before production. |

---

## 5. Deployment & operations

| Recommendation | Why |
|----------------|-----|
| **Env vars** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; use service role only server-side if needed. |
| **Custom domain** | Point `digg-ct.co.za` at Vercel (or host) and set in dashboard. |
| **Storage buckets** | Ensure Supabase buckets (e.g. hero, logo, team, portfolio) and policies match app usage. |
| **Backups** | Supabase backups and/or periodic export of `site_settings`, `pages`, `form_submissions`. |

---

## 6. Accessibility & SEO

| Recommendation | Why |
|----------------|-----|
| **Focus states** | Already using `focus-visible`; keep orange ring on all interactive elements. |
| **Heading order** | In page builder sections, keep H1 → H2 → H3 order (one H1 per page). |
| **Alt text** | Encourage alt text for every image in Images and Selected Work. |
| **Semantic sections** | Keep using `<section>`, landmarks, and clear labels for nav/footer. |
| **Sitemap** | Optional `/sitemap.xml` (static + CMS slugs) for search engines. |

---

## Priority order (suggested)

1. **RLS for `pages`** (if not already) so `/[slug]` works in production.  
2. **Page delete & duplicate** and **Preview** for a complete page workflow.  
3. **Selected Work reorder** so homepage order is controllable.  
4. **Custom 404** and **Favicon/OG** in Settings.  
5. **Form submission detail** and **read/archive** for better lead handling.  
6. **Insights** when you want a blog/thinking section.  
7. **Analytics** and **error monitoring** once live.

Use **ADMIN_RECOMMENDATIONS.md** and **DESIGN_RECOMMENDATIONS.md** for the original detailed notes; this file is the consolidated “other recommendations” list.
