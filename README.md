# DIGG Website CMS

A Next.js-based CMS for DIGG Architecture website with full admin capabilities.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_secret_key
   ```

3. **Run database migrations:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

4. **Set up storage buckets:**
   - Go to Supabase Dashboard → Storage
   - Create buckets: `hero-images`, `logos`, `team-photos`, `portfolio`
   - Set public read access, admin write access

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
app/
  (public)/          # Public-facing pages
  admin/             # Admin panel (protected)
  api/               # API routes
components/
  public/            # Public components
  admin/             # Admin components
lib/
  supabase/          # Supabase clients
  types/             # TypeScript types
supabase/
  migrations/        # Database migrations
```

## Admin Access

1. Create an admin user in Supabase Dashboard → Authentication
2. Login at `/admin/login`
3. Access dashboard at `/admin/dashboard`

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Features

- ✅ Full admin panel for content management
- ✅ Image upload and management
- ✅ Page editor with rich text
- ✅ Layout and style customization
- ✅ Form submission management
- ✅ SEO-friendly dynamic pages
