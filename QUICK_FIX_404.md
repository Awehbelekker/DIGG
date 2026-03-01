# Quick Fix for 404 NOT_FOUND Error

## Most Likely Cause: Missing Environment Variables

The error `404: NOT_FOUND` with code `cpt1::sdbcg-...` is usually caused by missing environment variables in Vercel.

## Immediate Fix

### Step 1: Add Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these three variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   Value: Your Supabase project URL (from `.env.local`)

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   Value: Your Supabase anon key (from `.env.local`)

   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```
   Value: Your Supabase service role key (from `.env.local`)

3. **Important:** Enable for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete

## Verify Fix

1. Check deployment logs for errors
2. Visit your site URL
3. Should load without 404 error

## If Still Getting 404

### Check These:

1. **Build Logs:**
   - Go to Vercel → Deployments → Latest → Build Logs
   - Look for errors or warnings

2. **Function Logs:**
   - Go to Vercel → Deployments → Latest → Function Logs
   - Check for runtime errors

3. **Environment Variables:**
   - Double-check variable names (case-sensitive)
   - No extra spaces in values
   - All three are set

4. **Supabase:**
   - Verify project is active
   - Check URL and keys are correct

## Alternative: Test Locally First

```bash
cd digg-website-cms
npm install
npm run dev
```

If it works locally but not on Vercel = environment variable issue

## Still Not Working?

Check `TROUBLESHOOTING.md` for more detailed debugging steps.
