# SQL Setup Guide for DIGG CMS

## Step-by-Step Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (DIGG)
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**

5. **Copy the ENTIRE contents** of `supabase/migrations/001_initial_schema.sql`
6. **Paste into the SQL Editor**
7. Click **Run** (or press Ctrl+Enter)

This creates all the tables and security policies.

### Step 2: Run Seed Data

1. In the same SQL Editor, click **New query** again
2. **Copy the ENTIRE contents** of `supabase/seed.sql`
3. **Paste into the SQL Editor**
4. Click **Run**

This creates the initial pages and settings.

### Step 3: Verify Tables Were Created

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pages', 'images', 'site_settings', 'form_submissions');
```

You should see all 4 tables listed.

### Step 4: Verify Seed Data

Run this query:

```sql
SELECT slug, title, published FROM pages;
```

You should see 5 pages: home, about, for-agents, give, contact.

## Troubleshooting

### If you get "NSERT" error:

This means there's a hidden character. Try this:

1. **Don't copy from the file directly** - instead, type the INSERT statement manually, OR
2. **Copy each statement separately** - copy just the INSERT line, not the whole file
3. **Use the SQL Editor's file upload** if available

### Alternative: Run Statements One at a Time

If the full file doesn't work, run each INSERT separately:

**First INSERT:**
```sql
INSERT INTO pages (slug, title, content, meta_title, meta_description, published) VALUES
('home', 'Home', '{"sections": []}', 'DIGG Architecture Cape Town | Property That Pays', 'Cape Town architecture team specialising in income-generating design — Airbnb units, secondary dwellings, rezoning and property investment.', true),
('about', 'About', '{"sections": []}', 'About DIGG | Judy Downing & Our Team | Cape Town', 'Meet the DIGG team, led by Judy Downing — SACAP architect with 12+ years experience and a personal track record as Cape Town property investor since 2016.', true),
('for-agents', 'For Agents', '{"sections": []}', 'Estate Agent Partners | DIGG Architecture', 'Partner with the DIGG team to offer your sellers professional plans and 3D models as part of every listing. Cape Town estate agents welcome.', true),
('give', 'Give', '{"sections": []}', 'Community | DIGG Architecture Cape Town', 'DIGG gives back through student mentorship, SME support, urban activation at Echium Park, and community gardening.', true),
('contact', 'Contact', '{"sections": []}', 'Contact DIGG | Cape Town Architecture Team', 'Talk to the DIGG team about your property project. First conversation free. Call Judy on 082 707 7080.', true)
ON CONFLICT (slug) DO NOTHING;
```

**Second INSERT:**
```sql
INSERT INTO site_settings (key, value) VALUES
('site_name', '"DIGG Architecture"'),
('contact_email', '"judy@digg-ct.co.za"'),
('phone', '"082 707 7080"'),
('location', '"Cape Town, South Africa"')
ON CONFLICT (key) DO NOTHING;
```

## Next Steps After SQL Setup

1. Create storage buckets (see IMPLEMENTATION_COMPLETE.md)
2. Create admin user in Authentication
3. Test the application
