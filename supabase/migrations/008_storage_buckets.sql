-- Create storage buckets for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT (id) DO NOTHING;

-- Allow anyone to VIEW files (public buckets)
CREATE POLICY "Public read hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public read team-photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to UPLOAD files
CREATE POLICY "Auth upload hero-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload team-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE files (e.g. overwrite)
CREATE POLICY "Auth update hero-images" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update team-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Allow authenticated users to DELETE files
CREATE POLICY "Auth delete hero-images" ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete team-photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
