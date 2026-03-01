# Quick Deployment Steps

## ✅ Git Repository Ready

Your code is committed and ready to push to GitHub.

## Step 1: Push to GitHub

### Option A: Use Existing Repository
If you already have a GitHub repo (like `https://github.com/Awehbelekker/DIGG`):

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
git remote add origin https://github.com/Awehbelekker/DIGG.git
git push -u origin main
```

### Option B: Create New Repository
1. Go to https://github.com/new
2. Repository name: `digg-website-cms`
3. **DO NOT** initialize with README
4. Click "Create repository"
5. Then run:

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
git remote add origin https://github.com/YOUR_USERNAME/digg-website-cms.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login (use GitHub to connect)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js ✅

3. **Add Environment Variables:**
   In the "Environment Variables" section, add these 3:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_publishable_key_here
   SUPABASE_SERVICE_ROLE_KEY = your_secret_key_here
   ```

   **Important:** Enable for Production, Preview, AND Development (check all 3 boxes)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at: `your-project.vercel.app`

## Step 3: Configure Custom Domain

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `digg-ct.co.za`
3. Follow DNS instructions Vercel provides
4. Wait for DNS propagation (24-48 hours)

## Build Process

Vercel automatically:
- ✅ Detects Next.js framework
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Deploys to CDN
- ✅ Provides HTTPS automatically

**No manual build needed!** Vercel handles everything.

## Continuous Deployment

Once connected:
- **Every push to `main`** = Auto-deploys to production
- **Every pull request** = Creates preview deployment
- **No manual steps needed!**

## What Gets Built

Vercel builds:
- All Next.js pages
- React components
- TypeScript compilation
- Static assets
- API routes (if any)

Everything is optimized automatically.

## After Deployment

1. **Test your live site:**
   - Visit your Vercel URL
   - Test all pages
   - Test admin login

2. **Update Supabase (if needed):**
   - Add Vercel domain to allowed URLs in Supabase Settings → API

3. **You're live!** 🎉
