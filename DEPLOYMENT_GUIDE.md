# Deployment Guide - GitHub & Vercel

## Prerequisites Checklist

Before deploying, make sure:
- [x] Database migration run successfully
- [x] Seed data inserted
- [x] Admin user created
- [ ] Storage buckets created (optional for initial deploy)
- [ ] Tested locally with `npm run dev`

## Step 1: Prepare for Git

### Initialize Git Repository

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
git init
git add .
git commit -m "Initial DIGG CMS implementation - Next.js with Supabase"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `digg-website-cms` (or your preferred name)
3. Description: "DIGG Architecture CMS - Next.js with Supabase"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Connect and Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/digg-website-cms.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (`digg-website-cms`)
   - Vercel will auto-detect Next.js

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_secret_key_here
   ```

   **Important:** 
   - Add these for **Production**, **Preview**, and **Development** environments
   - Check all three boxes when adding each variable

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

6. **Get Your URL:**
   - After deployment, you'll get a URL like: `digg-website-cms.vercel.app`
   - Your site is now live!

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd C:\Users\Judy\Downloads\digg-website-cms
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? digg-website-cms
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: your_supabase_url_here
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: your_publishable_key_here
# Select: Production, Preview, Development

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: your_secret_key_here
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

## Step 3: Configure Custom Domain (digg-ct.co.za)

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `digg-ct.co.za`
   - Click "Add"

2. **Configure DNS:**
   - Vercel will show you DNS records to add
   - Go to your domain registrar (where you bought digg-ct.co.za)
   - Add the DNS records Vercel provides:
     - Type: `A` or `CNAME`
     - Name: `@` or `www`
     - Value: (provided by Vercel)

3. **Wait for DNS Propagation:**
   - Can take 24-48 hours
   - Vercel will show status: "Valid Configuration" when ready

## Step 4: Update Supabase Settings

After deployment, update Supabase to allow your Vercel domain:

1. **Go to Supabase Dashboard → Settings → API**
2. **Add to Allowed URLs:**
   - `https://digg-ct.co.za`
   - `https://your-project.vercel.app` (your Vercel URL)
   - `http://localhost:3000` (for local development)

3. **Update CORS (if needed):**
   - Supabase should auto-handle CORS, but if you get CORS errors:
   - Go to Settings → API → CORS
   - Add your Vercel domain

## Step 5: Verify Deployment

1. **Test Public Site:**
   - Visit your Vercel URL
   - Check all pages load
   - Test navigation

2. **Test Admin Login:**
   - Visit: `https://your-url.vercel.app/admin/login`
   - Login with: `judydowning01@gmail.com`
   - Verify admin panel works

3. **Test Forms:**
   - Submit contact form
   - Check admin panel for submission

## Build Process

Vercel automatically:
1. **Detects Next.js** and uses correct build settings
2. **Runs:** `npm install` (installs dependencies)
3. **Runs:** `npm run build` (builds Next.js app)
4. **Deploys** the `.next` folder
5. **Serves** via Vercel's CDN

**Build time:** Usually 2-3 minutes

## Continuous Deployment

Once connected to GitHub:
- **Every push to `main` branch** = Auto-deploy to production
- **Every pull request** = Auto-deploy preview URL
- **No manual deployment needed!**

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Environment variable missing"**
- Verify all 3 env vars are set in Vercel
- Check they're enabled for Production/Preview/Development

**Error: "Build timeout"**
- Free tier has 45min limit
- Check for infinite loops or heavy processes
- Optimize build if needed

### Site Works But Admin Login Fails

- Check Supabase allowed URLs include your Vercel domain
- Verify environment variables are correct
- Check browser console for errors

### Images Don't Upload

- Verify storage buckets exist in Supabase
- Check bucket names match exactly
- Verify storage policies allow authenticated writes

## Post-Deployment Checklist

- [ ] Site loads on Vercel URL
- [ ] All pages accessible
- [ ] Admin login works
- [ ] Forms submit successfully
- [ ] Images can be uploaded (if buckets created)
- [ ] Custom domain configured (if applicable)
- [ ] DNS propagated
- [ ] HTTPS working (automatic with Vercel)

## Next Steps After Deployment

1. **Add your images:**
   - Login to admin panel
   - Upload hero images, logo, team photos
   - Update pages with images

2. **Customize content:**
   - Edit pages via admin panel
   - Update text, add sections
   - Publish changes

3. **Monitor:**
   - Check Vercel Analytics (if enabled)
   - Monitor form submissions
   - Review admin activity

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs
