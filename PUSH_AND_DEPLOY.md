# Push to GitHub & Connect Data Storage (Supabase)

Use this to push your local DIGG-Website-CMS to [GitHub (Awehbelekker/DIGG)](https://github.com/Awehbelekker/DIGG) and ensure [Vercel (digg)](https://vercel.com/richards-projects-c5574a7d/digg) and [Supabase](https://supabase.com/dashboard/project/xrthcowlcohqlfwurryz) are set up for data storage.

---

## 1. Push to GitHub

In a terminal, from your project folder:

```powershell
cd C:\Users\Judy\Downloads\DIGG-Website-CMS

# If this is not yet a git repo:
git init

# Add the GitHub repo as remote (if not already added)
git remote add origin https://github.com/Awehbelekker/DIGG.git
# If remote already exists but points elsewhere, set URL:
# git remote set-url origin https://github.com/Awehbelekker/DIGG.git

# Stage and commit all changes
git add .
git status
git commit -m "CMS updates: page builder, logo options, delete/duplicate, 404, form detail, Selected Work reorder"

# Push to main (use your branch name if different)
git push -u origin main
```

If GitHub asks for login, use a [Personal Access Token](https://github.com/settings/tokens) or GitHub CLI (`gh auth login`).

---

## 2. Get Supabase keys (for data storage)

1. Open **[Supabase Dashboard](https://supabase.com/dashboard/project/xrthcowlcohqlfwurryz)**.
2. Go to **Project Settings** (gear) → **API**.
3. Copy:
   - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → use for `SUPABASE_SERVICE_ROLE_KEY` (optional; only if you use admin/server-side Supabase calls that need bypass RLS)

Your URL is already: `https://xrthcowlcohqlfwurryz.supabase.co`

---

## 3. Add env vars in Vercel (so the deployed app has data storage)

1. Open **[Vercel – digg project](https://vercel.com/richards-projects-c5574a7d/digg)**.
2. Go to **Settings** → **Environment Variables**.
3. Add (for **Production**, and optionally Preview):

| Name | Value | Notes |
|------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xrthcowlcohqlfwurryz.supabase.co` | From Supabase → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste anon key) | From Supabase → API |
| `SUPABASE_SERVICE_ROLE_KEY` | (paste service_role key) | Optional; for server-side admin |

4. **Save** and trigger a **Redeploy** (Deployments → … → Redeploy) so the new env vars are used.

---

## 4. Supabase: database and storage (data storage)

- **Database:** Run the migration once if you haven’t already:  
  Supabase → **SQL Editor** → run contents of `supabase/migrations/001_initial_schema.sql`  
  This creates `pages`, `images`, `site_settings`, `form_submissions` and RLS.

- **Storage (images):** In Supabase → **Storage**, create buckets (e.g. `hero-images`, `logos`, `team-photos`, `portfolio`) with:
  - Public read access
  - Authenticated write (so only logged-in admin can upload)

- **Auth:** Create at least one user in **Authentication → Users** so you can log in at `yoursite.com/admin/login`.

---

## 5. Connect Vercel to GitHub (if not already)

1. In [Vercel – digg](https://vercel.com/richards-projects-c5574a7d/digg), go to **Settings** → **Git**.
2. Connect **Awehbelekker/DIGG** if it isn’t connected.
3. After you `git push`, Vercel will build and deploy; the app will use the env vars above and your Supabase project for all data storage.

---

## Quick checklist

- [ ] Push code to `https://github.com/Awehbelekker/DIGG`
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and optionally `SUPABASE_SERVICE_ROLE_KEY`) in Vercel
- [ ] Run `001_initial_schema.sql` in Supabase if not done
- [ ] Create storage buckets and one admin user in Supabase
- [ ] Redeploy on Vercel and test site + admin login
