# Fix: Incorrect SUPABASE_URL Environment Variable

## ❌ Problem Found

Your `NEXT_PUBLIC_SUPABASE_URL` in Vercel is set to:
```
postgresql://postgres:SmileyRiley@2024@db.xrthcowlcohqlfwurryz.supabase.co:5432/postgres
```

**This is WRONG!** This is a PostgreSQL database connection string, not the Supabase API URL.

## ✅ Correct Value

The `NEXT_PUBLIC_SUPABASE_URL` should be:
```
https://xrthcowlcohqlfwurryz.supabase.co
```

## How to Fix

### Step 1: Update in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Find `NEXT_PUBLIC_SUPABASE_URL`

3. Click **Edit** (or delete and recreate)

4. Change the value to:
   ```
   https://xrthcowlcohqlfwurryz.supabase.co
   ```

5. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. Click **Save**

### Step 2: Verify Other Variables

Your other variables look correct:
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Correct (JWT token)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Correct (JWT token)

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete (2-3 minutes)

### Step 4: Test

After redeploy:
1. Visit your site URL
2. Should load without 404 errors
3. Check browser console (F12) - should have no errors

## Why This Matters

- **PostgreSQL connection string** = Direct database access (not what Next.js needs)
- **Supabase API URL** = REST API endpoint (what Next.js uses)

Next.js uses the Supabase JavaScript client which needs the API URL, not a direct database connection.

## Quick Reference

**Correct Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://xrthcowlcohqlfwurryz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydGhjb3dsY29ocWxmd3Vycnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTExMDgsImV4cCI6MjA4Nzk2NzEwOH0.CeVlGxSiFloUkG8aUOcHbWsdQnnb1O7aTTXTkhmvpzg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydGhjb3dsY29ocWxmd3Vycnl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM5MTEwOCwiZXhwIjoyMDg3OTY3MTA4fQ.anRe0qwujEJNCHi4fx0ujs2SeAIcNl_94FSI1oo6jlQ
```

## After Fixing

Once you update the URL and redeploy:
- ✅ Site should load
- ✅ No more 404 errors
- ✅ Pages should work
- ✅ Admin login should work (if Supabase is configured)
