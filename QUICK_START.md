# Quick Start Guide

## ✅ What's Been Set Up

1. **Next.js Project** - Fully configured with TypeScript and Tailwind
2. **Supabase Integration** - Client files ready, just need to run migration
3. **Public Components** - Navbar, Footer, Hero, Stats sections
4. **Homepage** - Complete with all sections from original design

## 🚀 Get Started

### 1. Run Database Migration

**In Supabase Dashboard:**
1. Go to SQL Editor
2. Open `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL file
4. Paste into SQL Editor
5. Click "Run"

This creates:
- `pages` table (for storing page content)
- `images` table (for image metadata)
- `site_settings` table (for global settings)
- `form_submissions` table (for contact/agent forms)
- Row Level Security policies

### 2. Create Storage Buckets

**In Supabase Dashboard → Storage:**
1. Click "New bucket"
2. Create these buckets (one at a time):
   - Name: `hero-images`
     - Public bucket: ✅ Yes
     - File size limit: 5MB
     - Allowed MIME types: image/*
   
   - Name: `logos`
     - Public bucket: ✅ Yes
     - File size limit: 2MB
     - Allowed MIME types: image/*
   
   - Name: `team-photos`
     - Public bucket: ✅ Yes
     - File size limit: 5MB
     - Allowed MIME types: image/*
   
   - Name: `portfolio`
     - Public bucket: ✅ Yes
     - File size limit: 10MB
     - Allowed MIME types: image/*

### 3. Start Development Server

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
npm run dev
```

Visit: http://localhost:3000

You should see the homepage with:
- Hero section
- Problem/Solution strip
- Stats bar
- Products grid
- Estate agent CTA

### 4. Test Navigation

All navigation links are set up. Pages to create next:
- `/about` - About page
- `/for-agents` - Estate agent page
- `/give` - Community page
- `/contact` - Contact page

## 📝 Next: Build Admin Panel

Once the basic site is working, we'll build:
1. Admin login page
2. Protected admin routes
3. Dashboard
4. Page editor
5. Image upload manager

## 🔧 Troubleshooting

**Can't see the site?**
- Make sure you're running `npm run dev`
- Check terminal for errors
- Verify port 3000 is available

**Database errors?**
- Make sure migration was run successfully
- Check Supabase project URL matches `.env.local`
- Verify API keys are correct

**Styling looks wrong?**
- Clear browser cache
- Check that Tailwind is compiling (should see no errors in terminal)
