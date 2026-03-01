-- Seed initial data for DIGG website
-- Run this AFTER running the migration file

-- Insert initial pages
INSERT INTO pages (slug, title, content, meta_title, meta_description, published) VALUES
('home', 'Home', '{"sections": []}', 'DIGG Architecture Cape Town | Property That Pays', 'Cape Town architecture team specialising in income-generating design — Airbnb units, secondary dwellings, rezoning and property investment.', true),
('about', 'About', '{"sections": []}', 'About DIGG | Judy Downing & Our Team | Cape Town', 'Meet the DIGG team, led by Judy Downing — SACAP architect with 12+ years experience and a personal track record as Cape Town property investor since 2016.', true),
('for-agents', 'For Agents', '{"sections": []}', 'Estate Agent Partners | DIGG Architecture', 'Partner with the DIGG team to offer your sellers professional plans and 3D models as part of every listing. Cape Town estate agents welcome.', true),
('give', 'Give', '{"sections": []}', 'Community | DIGG Architecture Cape Town', 'DIGG gives back through student mentorship, SME support, urban activation at Echium Park, and community gardening.', true),
('contact', 'Contact', '{"sections": []}', 'Contact DIGG | Cape Town Architecture Team', 'Talk to the DIGG team about your property project. First conversation free. Call Judy on 082 707 7080.', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial site settings
INSERT INTO site_settings (key, value) VALUES
('site_name', '"DIGG Architecture"'),
('contact_email', '"judy@digg-ct.co.za"'),
('phone', '"082 707 7080"'),
('location', '"Cape Town, South Africa"')
ON CONFLICT (key) DO NOTHING;
