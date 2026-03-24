-- Create storage buckets for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT (id) DO NOTHING;

-- Allow anyone to VIEW files (public buckets)
DROP POLICY IF EXISTS "Public read hero-images" ON storage.objects;
CREATE POLICY "Public read hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
DROP POLICY IF EXISTS "Public read team-photos" ON storage.objects;
CREATE POLICY "Public read team-photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
DROP POLICY IF EXISTS "Public read portfolio" ON storage.objects;
CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to UPLOAD files
DROP POLICY IF EXISTS "Auth upload hero-images" ON storage.objects;
CREATE POLICY "Auth upload hero-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth upload logos" ON storage.objects;
CREATE POLICY "Auth upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth upload team-photos" ON storage.objects;
CREATE POLICY "Auth upload team-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth upload portfolio" ON storage.objects;
CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE files (e.g. overwrite)
DROP POLICY IF EXISTS "Auth update hero-images" ON storage.objects;
CREATE POLICY "Auth update hero-images" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update logos" ON storage.objects;
CREATE POLICY "Auth update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update team-photos" ON storage.objects;
CREATE POLICY "Auth update team-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update portfolio" ON storage.objects;
CREATE POLICY "Auth update portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Allow authenticated users to DELETE files
DROP POLICY IF EXISTS "Auth delete hero-images" ON storage.objects;
CREATE POLICY "Auth delete hero-images" ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete logos" ON storage.objects;
CREATE POLICY "Auth delete logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete team-photos" ON storage.objects;
CREATE POLICY "Auth delete team-photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete portfolio" ON storage.objects;
CREATE POLICY "Auth delete portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
