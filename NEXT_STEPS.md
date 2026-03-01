# Next Steps - Complete Your DIGG CMS Setup

## ✅ Completed
- Database migration run
- Seed data inserted
- Tables created and populated

## 📋 Remaining Setup Steps

### 1. Create Storage Buckets (Required for Image Uploads)

Go to **Supabase Dashboard → Storage** and create these 4 buckets:

**Bucket 1: `hero-images`**
- Public bucket: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/*`

**Bucket 2: `logos`**
- Public bucket: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/*`

**Bucket 3: `team-photos`**
- Public bucket: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/*`

**Bucket 4: `portfolio`**
- Public bucket: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: `image/*`

**For each bucket, set storage policies:**
1. Click on the bucket → Policies
2. Create policy for **Public read access**:
   - Policy name: "Public read"
   - Allowed operation: SELECT
   - Policy definition: `true`
3. Create policy for **Authenticated write access**:
   - Policy name: "Authenticated write"
   - Allowed operation: INSERT, UPDATE, DELETE
   - Policy definition: `auth.role() = 'authenticated'`

### 2. Create Admin User (Required for Admin Panel Access)

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add user** (or **Invite user**)
3. Enter:
   - Email: (your admin email)
   - Password: (create a strong password)
4. **Save these credentials** - you'll need them to login
5. Click **Create user**

### 3. Test the Application

```bash
cd C:\Users\Judy\Downloads\digg-website-cms
npm run dev
```

**Test Public Site:**
- Visit: http://localhost:3000
- Check all pages load: Home, About, Contact, For Agents, Give
- Test navigation

**Test Admin Panel:**
- Visit: http://localhost:3000/admin/login
- Login with the email/password you created
- You should see the dashboard

**Test Admin Features:**
- ✅ View dashboard stats
- ✅ Go to Pages - see the 5 initial pages
- ✅ Go to Images - upload a test image
- ✅ Go to Forms - view any form submissions
- ✅ Go to Settings - update site settings

### 4. Test Form Submissions

1. Visit http://localhost:3000/contact
2. Fill out and submit the contact form
3. Go to Admin → Forms
4. You should see the submission appear

### 5. Upload Your First Image

1. Login to admin panel
2. Go to **Images**
3. Select folder (e.g., "Hero Images")
4. Add alt text (optional)
5. Choose an image file
6. Click upload
7. Image should appear in the gallery

## 🚀 Ready to Deploy?

Once everything is tested locally:

1. **Push to GitHub:**
   ```bash
   cd C:\Users\Judy\Downloads\digg-website-cms
   git init
   git add .
   git commit -m "Initial DIGG CMS implementation"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Deploy!

3. **Configure Custom Domain:**
   - In Vercel, add custom domain: `digg-ct.co.za`
   - Update DNS settings as instructed

## 📝 Quick Checklist

- [ ] Storage buckets created (4 buckets)
- [ ] Storage policies set (public read, authenticated write)
- [ ] Admin user created in Authentication
- [ ] Tested admin login
- [ ] Tested image upload
- [ ] Tested form submission
- [ ] All pages load correctly
- [ ] Ready to deploy!

## 🆘 Troubleshooting

**Can't login to admin?**
- Check user was created in Authentication
- Verify email/password are correct
- Check browser console for errors

**Image upload fails?**
- Verify storage buckets exist
- Check bucket names match exactly: `hero-images`, `logos`, `team-photos`, `portfolio`
- Verify storage policies are set

**Forms not saving?**
- Check browser console for errors
- Verify `form_submissions` table exists
- Check RLS policies are correct

**Need help?**
- Check `IMPLEMENTATION_COMPLETE.md` for full feature list
- Review `SETUP_INSTRUCTIONS.md` for detailed steps
