# Troubleshooting Guide - DIGG CMS

## Common Errors and Solutions

### 404: NOT_FOUND Error

**Error Code:** `cpt1::sdbcg-1772397564370-88c5de442f59`

This error can occur for several reasons:

#### 1. Missing Environment Variables

**Symptom:** Site loads but API calls fail, or build fails

**Solution:**
- Check Vercel Dashboard → Settings → Environment Variables
- Ensure all three variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Make sure they're enabled for **Production**, **Preview**, and **Development**
- Redeploy after adding variables

#### 2. Missing Route/Page

**Symptom:** 404 when accessing a specific URL

**Solution:**
- Check if the route exists in `app/` directory
- Verify file naming (Next.js App Router requires specific naming)
- Check `not-found.tsx` exists (we've added this)

#### 3. Build Failure

**Symptom:** Deployment fails or shows 404

**Solution:**
- Check Vercel build logs
- Look for TypeScript errors
- Verify all dependencies are in `package.json`
- Check for missing imports

#### 4. Supabase Connection Issues

**Symptom:** Pages load but data doesn't appear

**Solution:**
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify database tables exist (run migrations)
- Check RLS policies are set correctly

### Build Errors

#### "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

**Solution:**
- Check `tsconfig.json` paths are correct
- Verify all imports use correct paths
- Run `npm run build` locally to catch errors

### Runtime Errors

#### "Cannot read property of undefined"

**Solution:**
- Check components handle missing data gracefully
- Add optional chaining (`?.`)
- Add default values

#### Authentication Errors

**Solution:**
- Verify Supabase Auth is enabled
- Check user exists in Supabase dashboard
- Verify email confirmation (if required)
- Check middleware is working correctly

## Debugging Steps

### 1. Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on the latest deployment
5. Check "Build Logs" and "Function Logs"

### 2. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test build
npm run build
npm start
```

### 3. Check Environment Variables

```bash
# In Vercel Dashboard
Settings → Environment Variables

# Verify:
- All variables are set
- Enabled for correct environments
- No typos in variable names
- Values are correct (no extra spaces)
```

### 4. Check Supabase

1. Go to Supabase Dashboard
2. Check project status (should be active)
3. Verify tables exist:
   - `pages`
   - `images`
   - `site_settings`
   - `form_submissions`
4. Check storage buckets exist
5. Verify RLS policies

### 5. Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)
5. Check error messages

## Quick Fixes

### Clear Cache and Redeploy

1. In Vercel: Settings → General → Clear Build Cache
2. Redeploy project

### Reset Environment Variables

1. Remove all environment variables
2. Add them back one by one
3. Redeploy after each addition

### Check File Structure

Ensure your `app/` directory has:
```
app/
  layout.tsx
  page.tsx
  not-found.tsx
  about/
    page.tsx
  contact/
    page.tsx
  for-agents/
    page.tsx
  give/
    page.tsx
  admin/
    layout.tsx
    login/
      page.tsx
    dashboard/
      page.tsx
    ...
```

## Getting Help

### Information to Provide

1. **Error Message:** Full error text
2. **Error Code:** (e.g., `cpt1::sdbcg-...`)
3. **When it happens:** On load, specific action, etc.
4. **Vercel Logs:** Copy relevant log entries
5. **Browser Console:** Any JavaScript errors
6. **Network Tab:** Failed requests

### Check These First

- [ ] Environment variables are set in Vercel
- [ ] Supabase project is active
- [ ] Database migrations have been run
- [ ] Storage buckets are created
- [ ] Build succeeds locally (`npm run build`)

## Common Issues

### Issue: Homepage shows 404

**Fix:** Check `app/page.tsx` exists and exports default component

### Issue: Admin login doesn't work

**Fix:** 
- Check Supabase Auth is enabled
- Verify user exists
- Check middleware.ts is correct
- Verify environment variables

### Issue: Images don't load

**Fix:**
- Check storage bucket exists
- Verify bucket is public
- Check RLS policies allow read access
- Verify image URLs are correct

### Issue: Forms don't submit

**Fix:**
- Check Supabase connection
- Verify `form_submissions` table exists
- Check RLS policies allow inserts
- Check browser console for errors

## Still Stuck?

1. Check Vercel deployment logs
2. Test locally with `npm run dev`
3. Verify all setup steps in `SETUP_INSTRUCTIONS.md`
4. Check Supabase dashboard for errors
5. Review `DEPLOYMENT_GUIDE.md` for deployment steps
