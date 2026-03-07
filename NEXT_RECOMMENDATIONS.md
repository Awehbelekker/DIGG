# Next Recommendations & Features

What’s in place now, and the highest-value next steps (admin, public site, and growth).

---

## Already in place (recent additions)

| Area | Done |
|------|------|
| **Admin** | Built-in pages list (Home, About, Contact, etc.) with View + Configure; live preview pane when editing CMS pages; **Team** (list users, invite by email); **Homepage Products** editable in Settings (add/edit/reorder Built Products). |
| **Pages** | Page delete & duplicate; preview link; visual page builder (Hero, Text, Image, Grid, Stats, Products, CTA, Form); recommended starting sections with image blocks. |
| **Forms** | Submission detail view; CSV export; inline email validation; disabled submit while loading. |
| **Settings** | Hero image, Selected Work (with reorder), **Homepage Products**, favicon, OG image, typography, logo options. |
| **Public** | Custom 404 with nav; loading state for `[slug]`; skip to content; responsive nav; trust line in footer; product images on homepage and in Products section. |
| **Lint** | ESLint issues resolved (no-explicit-any, hooks, unescaped entities config). |

---

## High impact, relatively quick

| Recommendation | Why | Effort |
|----------------|-----|--------|
| **Sitemap** ✅ | `/sitemap.xml` with static routes + CMS page slugs for SEO. | Done |
| **Copy image URL** ✅ | In Admin → Images, a “Copy URL” button per image so you can paste into Settings / sections. | Done |
| **Analytics** ✅ | Optional script URL in layout (`NEXT_PUBLIC_ANALYTICS_SCRIPT`); set when ready for GA4/Plausible. | Done |
| **Draft preview** ✅ | View any page (including drafts) at `/preview/[id]` when logged in; links in admin. | Done |
| **Per-page OG image** ✅ | In page editor, optional “OG Image URL”; used in metadata for `/[slug]` when set. | Done |
| **Insights / blog** ✅ | Admin CRUD; public `/insights` and `/insights/[slug]`; in nav and sitemap. | Done |
| **Form read/archive** ✅ | Mark submissions read or archived; filter list by All / Unread / Read / Archived. | Done |

---

## Content & marketing

| Recommendation | Why | Effort |
|----------------|-----|--------|
| **Contact in nav or hero** | Phone number or “Call” in navbar or hero on mobile can increase enquiries. | Small |
| **Newsletter signup** | Optional form + storage (e.g. Supabase table or integration) for leads who don’t fill contact yet. | Medium |

---

## Admin & workflow

| Recommendation | Why | Effort |
|----------------|-----|--------|
| **Images: bulk actions** ✅ | Select multiple → bulk delete, set folder, or set alt text in Admin → Images. | Done |
| **URL validation in Settings** ✅ | "Check image URLs" in Settings validates hero, Selected Work, and Homepage Product images. | Done |
| **Multi-user roles** | “Editor” (content only) vs “Admin” (settings, users, delete). Needs roles in DB or Supabase custom claims. | Larger |

---

## Technical & operations

| Recommendation | Why | Effort |
|----------------|-----|--------|
| **Error monitoring** ✅ | Global error boundary + ERROR_MONITORING.md (Sentry/Vercel steps). | Done |
| **Staging** | Separate Supabase project + Vercel preview env for testing before production. | Medium |
| **Backups** | Supabase backups; optional export of `site_settings`, `pages`, `form_submissions`. | Small (docs) / Medium (automated) |

---

## Suggested order to tackle

1. ~~**Copy image URL** + **Sitemap**~~ — done.  
2. ~~**Analytics placeholder**~~ — set `NEXT_PUBLIC_ANALYTICS_SCRIPT` when ready.  
3. ~~**Per-page OG image**~~ — use “OG Image URL” in page editor for social sharing.  
4. ~~**Draft preview**~~ — use “Preview” / “Preview draft” in admin.  
5. ~~**Insights**~~ — Admin → Insights; public /insights.  
6. ~~**Form read/archive**~~ — filter and mark read/archived in Form Submissions.

Use **RECOMMENDATIONS.md**, **ADMIN_RECOMMENDATIONS.md**, and **UI_UX_MOBILE_RECOMMENDATIONS.md** for the full lists; this file is the “what to do next” summary.
