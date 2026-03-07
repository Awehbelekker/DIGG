# Admin Dashboard — Capabilities & Recommendations

Use this as the single reference for what the admin can do today and what to add next. All admin page headings use the same style (site heading font + DIGG navy).

---

## Current Admin Capabilities

| Area | Page | What the admin can do |
|------|------|------------------------|
| **Dashboard** | `/admin/dashboard` | View counts (pages, images, form submissions), recent submissions, quick links to Settings and key areas. |
| **Pages** | `/admin/pages` | List all pages, create new page, edit page (title, slug, content as JSON, publish/draft), delete not in UI but can be added. |
| **Images** | `/admin/images` | Upload images to folders (hero, logo, team, portfolio), view gallery, filter by folder, delete image, set alt text. |
| **Form Submissions** | `/admin/forms` | View all contact and agent submissions, see full data (name, email, phone, message, etc.), filter by type via display. |
| **Settings** | `/admin/settings` | Contact email, phone, site name; **Hero image URL**; **Favicon URL**; **OG image URL**; **Selected Work** (homepage projects: title, place, image URL, link). |

---

## Recommended Additions (Priority Order)

### High priority (finish core dashboard)

1. **Form submissions: single view & export**
   - View one submission in a detail view (e.g. `/admin/forms/[id]`).
   - Export submissions to CSV (e.g. “Export CSV” button on Forms page).

2. **Pages: delete & duplicate**
   - Delete page with confirmation.
   - Duplicate page (copy title, slug-append “-copy”, content, draft).

3. **Dashboard: quick actions**
   - Short links: “Edit homepage hero & Selected Work” → Settings.
   - “View site” link (opens public homepage in new tab).

4. **Images: copy URL**
   - “Copy URL” button per image so admin can paste into Settings (hero, Selected Work, OG image).

### Medium priority (content & workflow)

5. **Insights / Thinking**
   - New content type: title, slug, excerpt, body (rich text or markdown), published_at.
   - Admin: list, create, edit, delete. Public: `/insights` and `/insights/[slug]`.

6. **Selected Work: reorder**
   - Drag-and-drop or up/down buttons to reorder projects on the homepage.

7. **Pages: preview**
   - “Preview” opens the public page (or draft preview) in a new tab.

8. **Settings: validation**
   - Check hero / favicon / OG / Selected Work image URLs load (optional; can show warning if invalid).

### Lower priority (nice to have)

9. **Activity log**
   - Optional table: last login, last page update, last image upload (if you add tracking).

10. **Multi-user / roles**
    - Separate “editor” vs “admin” (e.g. editor can edit content, only admin can change settings or delete).

11. **Media library: bulk actions**
    - Select multiple images, bulk delete or bulk assign folder/alt.

12. **Form submissions: mark as read / archive**
    - Mark submission as read; optional “archive” so they don’t clutter the main list.

---

## Required Pages & Functions (Checklist)

- [x] **Login** — `/admin/login`, protected by auth.
- [x] **Dashboard** — overview, stats, recent submissions, quick links (Hero & Selected Work, View site).
- [x] **Pages** — list, create, edit; all use `AdminPageHeading`.
- [x] **Images** — upload, list, filter, delete, alt, **Copy URL**; uses `AdminPageHeading`.
- [x] **Form Submissions** — list with full data, **Export CSV**; uses `AdminPageHeading`.
- [x] **Settings** — contact, hero, favicon, OG, Selected Work; uses `AdminPageHeading`.
- [ ] **Form submission detail** — optional single view.
- [x] **Form export (CSV)** — implemented.
- [ ] **Page delete / duplicate** — optional.
- [ ] **Insights** — optional section + public routes.

---

## Heading Style (Admin)

All admin main page titles use:

- **Font:** Same as site headings (`var(--font-heading)` → Playfair Display).
- **Color:** DIGG navy (`#1B2A6B`).
- **Weight:** Bold, tracking-tight.
- **Component:** `<AdminPageHeading>` (and optional subtitle).

Section headings (e.g. “Recent Form Submissions”) use the same font with a smaller size (e.g. `AdminPageHeading as="h2"`).

---

## File Reference

| Purpose | Path |
|--------|------|
| Admin layout (auth + nav) | `app/admin/(dashboard)/layout.tsx` |
| Admin nav component | `components/admin/AdminNav.tsx` |
| Admin page heading | `components/admin/AdminPageHeading.tsx` |
| Dashboard | `app/admin/(dashboard)/dashboard/page.tsx` |
| Pages CRUD | `app/admin/(dashboard)/pages/page.tsx`, `pages/[id]/page.tsx`, `pages/new/page.tsx` |
| Images | `app/admin/(dashboard)/images/page.tsx` |
| Forms | `app/admin/(dashboard)/forms/page.tsx` |
| Settings | `app/admin/(dashboard)/settings/page.tsx` |

---

## Next Steps

1. Implement high-priority items (form export, copy image URL, page delete/duplicate, dashboard quick links) if you want the dashboard “finished” for day-to-day use.
2. Add Insights when you want an “Insights / Thinking” section managed from the CMS.
3. Keep using `AdminPageHeading` (and optional subtitle) on any new admin pages for consistency.
