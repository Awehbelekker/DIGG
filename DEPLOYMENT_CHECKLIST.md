# Deployment Checklist - DIGG CMS

## ✅ Completed

- [x] Code pushed to GitHub
- [x] Git repository initialized
- [x] All files committed
- [x] API keys removed from documentation

## 📋 Remaining Steps

### 1. Deploy to Vercel

- [ ] Sign up/Login to Vercel (https://vercel.com)
- [ ] Import GitHub repository (`Awehbelekker/DIGG`)
- [ ] Add environment variables (see `ENV_VARS_FOR_VERCEL.txt`)
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Test live site

### 2. Configure Domain

- [ ] Add domain `digg-ct.co.za` in Vercel
- [ ] Get nameservers from Vercel
- [ ] Update nameservers in GoDaddy
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify domain works

### 3. Supabase Setup (If Not Done)

- [ ] Create storage buckets (hero-images, logos, team-photos, portfolio)
- [ ] Set storage policies (public read, authenticated write)
- [ ] Test admin login works
- [ ] Test image upload works

### 4. Final Testing

- [ ] Test all public pages load
- [ ] Test admin login
- [ ] Test form submissions
- [ ] Test image upload
- [ ] Verify HTTPS works
- [ ] Test on mobile devices

## Environment Variables for Vercel

Copy from `ENV_VARS_FOR_VERCEL.txt`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

**Enable for:** Production, Preview, Development

## Domain Nameservers

**Current (GoDaddy):**
- ns77.domaincontrol.com
- ns78.domaincontrol.com

**New (from Vercel):**
- Will be provided when you add domain
- Update in GoDaddy domain settings

## Quick Links

- **GitHub Repo:** https://github.com/Awehbelekker/DIGG
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

## Support Docs

- `VERCEL_DEPLOY.md` - Detailed Vercel deployment steps
- `DOMAIN_SETUP.md` - Domain configuration guide
- `ENV_VARS_FOR_VERCEL.txt` - Environment variables to copy
