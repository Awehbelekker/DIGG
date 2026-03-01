# DIGG CMS Setup Instructions - Step by Step

## ⚠️ IMPORTANT: Run in Order!

You MUST run the migration file FIRST before running the seed file. The migration creates the tables, the seed file populates them.

## Step 1: Run Database Migration (REQUIRED FIRST)

1. Go to **Supabase Dashboard** → Your DIGG project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file: `supabase/migrations/001_initial_schema.sql`
5. **Copy the ENTIRE file contents** (Ctrl+A, Ctrl+C)
6. **Paste into Supabase SQL Editor**
7. Click **Run** (or press Ctrl+Enter)

**Wait for success message** - This creates all 4 tables:
- `pages`
- `images`
- `site_settings`
- `form_submissions`

## Step 2: Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pages', 'images', 'site_settings', 'form_submissions');
```

You should see 4 rows returned. If not, the migration didn't work - check for errors.

## Step 3: Run Seed Data (AFTER Migration)

1. In SQL Editor, click **New query** again
2. Open the file: `supabase/seed.sql`
3. **Copy the ENTIRE file contents**
4. **Paste into Supabase SQL Editor**
5. Click **Run**

This creates the initial 5 pages and 4 settings.

## Step 4: Verify Seed Data

Run this query:

```sql
SELECT slug, title, published FROM pages ORDER BY slug;
```

You should see:
- about
- contact
- for-agents
- give
- home

## Troubleshooting

### Error: "relation pages does not exist"
**Solution:** You skipped Step 1. Go back and run the migration file first.

### Error: "NSERT" or missing "I"
**Solution:** 
- Try typing the INSERT statement manually
- Or use `seed_alternative.sql` which has individual statements
- Or copy just the INSERT line (not the whole file)

### Error: "syntax error"
**Solution:**
- Make sure you copied the ENTIRE file
- Check that previous statements end with semicolons
- Try running one INSERT at a time from `seed_alternative.sql`

## Next Steps After SQL Setup

1. ✅ Create storage buckets (see below)
2. ✅ Create admin user in Authentication
3. ✅ Test the application

## Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these 4 buckets (one at a time):

   **Bucket 1:**
   - Name: `hero-images`
   - Public bucket: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

   **Bucket 2:**
   - Name: `logos`
   - Public bucket: ✅ Yes
   - File size limit: 2MB
   - Allowed MIME types: `image/*`

   **Bucket 3:**
   - Name: `team-photos`
   - Public bucket: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

   **Bucket 4:**
   - Name: `portfolio`
   - Public bucket: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*`

3. For each bucket, set policies:
   - **Public read access** (anyone can view)
   - **Authenticated write access** (only logged-in admins can upload)

## Create Admin User

1. Go to **Authentication** in Supabase Dashboard
2. Click **Users** → **Add user** (or **Invite user**)
3. Enter email and password
4. **Save the credentials** - you'll use these to login at `/admin/login`

## Test the Application

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

Use the email/password you created in Authentication to login.
