# Vercel Deployment - Ready to Deploy! 🚀

## ✅ Code Pushed to GitHub

Your DIGG CMS code is now on GitHub: https://github.com/Awehbelekker/DIGG

## Next: Deploy to Vercel

### Step 1: Connect to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login (use "Continue with GitHub" for easiest setup)

2. **Import Your Project:**
   - Click "Add New..." → "Project"
   - Find and select: `Awehbelekker/DIGG`
   - Click "Import"

3. **Vercel Auto-Detection:**
   - Framework: Next.js ✅ (auto-detected)
   - Build Command: `npm run build` ✅ (auto-filled)
   - Output Directory: `.next` ✅ (auto-filled)
   - Install Command: `npm install` ✅ (auto-filled)
   - **No changes needed!** Just click "Deploy"

### Step 2: Add Environment Variables

**BEFORE clicking Deploy**, add these environment variables:

1. Click "Environment Variables" section
2. Add these 3 variables (one at a time):

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `[Get from your .env.local file or Supabase dashboard]`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `[Get from your .env.local file or Supabase dashboard]`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 3:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `[Get from your .env.local file or Supabase dashboard]`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **Important:** Check all 3 environment boxes for each variable!

### Step 3: Deploy

1. Click "Deploy" button
2. Wait 2-3 minutes for build
3. Your site will be live! 🎉

## Build Process

Vercel automatically:
- ✅ Installs dependencies (`npm install`)
- ✅ Builds Next.js app (`npm run build`)
- ✅ Optimizes for production
- ✅ Deploys to global CDN
- ✅ Provides HTTPS automatically

**Build time:** ~2-3 minutes

## After Deployment

### Your Live URLs:
- **Production:** `https://digg-website-cms.vercel.app` (or your custom name)
- **Admin Panel:** `https://your-url.vercel.app/admin/login`

### Test Everything:
1. ✅ Visit your live site
2. ✅ Test all pages (Home, About, Contact, etc.)
3. ✅ Login to admin panel with: `judydowning01@gmail.com`
4. ✅ Test form submissions
5. ✅ Test image upload (if buckets created)

## Configure Custom Domain

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add: `digg-ct.co.za`
3. Follow DNS instructions
4. Wait for DNS propagation (24-48 hours)

## Continuous Deployment

Once connected:
- **Every push to `main`** = Auto-deploys to production
- **Every pull request** = Creates preview URL
- **No manual steps needed!**

## Environment Variables Reference

Keep these handy for Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=[Your Supabase Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Your Supabase Service Role Key]
```

**Get these values from:**
- Your `.env.local` file (local project)
- Supabase Dashboard → Settings → API

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Verify all 3 env vars are enabled for all environments
- Check Vercel build logs for specific errors

**Site works but admin login fails?**
- Verify Supabase allowed URLs include your Vercel domain
- Check environment variables match your Supabase project

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Check build logs in Vercel Dashboard
