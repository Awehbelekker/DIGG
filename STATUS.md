# DIGG CMS — Status & Next Steps

**Last updated:** March 2025

Use this as the single place to see current status and what to do next. Other docs are linked where relevant.

---

## Current status

### ✅ Working

| Area | Status |
|------|--------|
| **Build** | `npm run build` succeeds |
| **Public site** | Home, About, Contact, For Agents, Give |
| **Admin panel** | Login, dashboard, pages, images, forms, settings |
| **Tech stack** | Next.js 16, TypeScript, Tailwind, Supabase |
| **Auth** | Admin routes protected; login/dashboard/logout |
| **Forms** | Contact & agent forms save to Supabase (when DB is set up) |
| **Docs** | Setup, deployment, troubleshooting guides in repo |

### ⏳ Manual setup required (Supabase)

These must be done in the [Supabase Dashboard](https://supabase.com/dashboard) before the CMS is fully usable:

1. **Database**
   - Run `supabase/migrations/001_initial_schema.sql` in SQL Editor.
   - Run `supabase/seed.sql` to create initial pages.

2. **Storage buckets** (for image uploads)
   - Create: `hero-images`, `logos`, `team-photos`, `portfolio`.
   - Public read; authenticated write. See `NEXT_STEPS.md` for policy details.

3. **Admin user**
   - Authentication → Add user (email + password).
   - Use these credentials at `/admin/login`.

---

## Pre-launch checklist

Use this before or right after deploying.

### Supabase

- [ ] Migration SQL run
- [ ] Seed SQL run
- [ ] Four storage buckets created with correct policies
- [ ] One admin user created in Authentication

### Local test

- [ ] `npm run dev` → site loads at http://localhost:3000
- [ ] All public pages load (Home, About, Contact, For Agents, Give)
- [ ] Admin login at http://localhost:3000/admin/login
- [ ] One test image upload in Admin → Images
- [ ] One test form submit (e.g. Contact) → appears in Admin → Forms

### Deploy (Vercel)

- [ ] Repo connected to Vercel
- [ ] Env vars set from `ENV_VARS_FOR_VERCEL.txt` (all three, all environments)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Supabase project URL (e.g. `https://xxx.supabase.co`), **not** Postgres connection string
- [ ] Build succeeds (Deployments → latest → Ready)
- [ ] Live site loads (no 404 on homepage)

### Domain

- [ ] Domain `digg-ct.co.za` added in Vercel
- [ ] DNS (e.g. GoDaddy) updated with Vercel nameservers
- [ ] SSL works after propagation

---

## Quick commands

```bash
# From project root
cd C:\Users\Judy\Downloads\DIGG-Website-CMS

# Install
npm install

# Dev
npm run dev

# Production build
npm run build
```

---

## Where to find more

| Need | Doc |
|------|-----|
| Supabase steps (buckets, policies, admin user) | `NEXT_STEPS.md` |
| What’s implemented | `IMPLEMENTATION_COMPLETE.md` |
| Vercel deploy & env vars | `DEPLOYMENT_CHECKLIST.md`, `VERCEL_DEPLOY.md` |
| Domain (digg-ct.co.za) | `DOMAIN_SETUP.md` |
| 404 or build issues | `CHECK_BUILD_STATUS.md` |
| Env vars for Vercel | `ENV_VARS_FOR_VERCEL.txt` |
| General setup | `README.md`, `SETUP_INSTRUCTIONS.md` |

---

## Non-urgent

- **Static DIGG-Website:** The static site in `DIGG-Website` is a reference/backup. Prefer the CMS as the single live site to avoid maintaining two codebases.
