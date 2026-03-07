-- 1. Per-page OG image (pages)
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_og_image TEXT;

-- 2. Insights table (blog/articles)
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_insights_published ON insights(published);
CREATE INDEX IF NOT EXISTS idx_insights_updated ON insights(updated_at DESC);
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published insights" ON insights;
CREATE POLICY "Public can view published insights" ON insights FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "Admins can manage insights" ON insights;
CREATE POLICY "Admins can manage insights" ON insights FOR ALL USING (auth.role() = 'authenticated');

-- 3. Form submissions: read and archive
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS "read" BOOLEAN DEFAULT false;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_form_submissions_read ON form_submissions("read");
CREATE INDEX IF NOT EXISTS idx_form_submissions_archived ON form_submissions(archived);

-- 4. Newsletter signups
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created ON newsletter_signups(created_at DESC);
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert newsletter signups" ON newsletter_signups;
CREATE POLICY "Anyone can insert newsletter signups" ON newsletter_signups FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view newsletter signups" ON newsletter_signups;
CREATE POLICY "Admins can view newsletter signups" ON newsletter_signups FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Seed About, Contact, For Agents, Give with FULL original content
-- Safe to run again — ON CONFLICT updates existing rows.
-- See supabase/migrations/007_seed_pages_with_content.sql for the full version.
-- Compact version below:

INSERT INTO pages (slug, title, meta_title, meta_description, content, published) VALUES
('about', 'About', 'About DIGG | Judy Downing & Our Team | Cape Town', 'Meet the DIGG team, led by Judy Downing — SACAP architect with 12+ years experience and a personal track record as Cape Town property investor since 2016.', '{"sections":[{"type":"hero","data":{"title":"The Team That Has Skin in the Game.","subtitle":"","primaryCTAtext":"See What We Do","primaryCTAhref":"#products","secondaryCTAtext":"Talk to Our Team","secondaryCTAhref":"/contact","backgroundImageUrl":""}},{"type":"text","data":{"heading":"","body":"Most architects will tell you how to make your property look better.\n\nThe DIGG team will show you how to make it pay.\n\nWe built DIGG around a frustration we kept seeing in the Cape Town property market: owners sitting on untapped potential with no trusted, practical guide to unlock it. Too many architects design for design''s sake. Too many developers overpromise. Too many homeowners leave value on the table.\n\nWe built DIGG to be different.","alignment":"left"}},{"type":"text","data":{"heading":"Judy''s Story — The Principal","body":"Twelve years. Every scale. Every sector.\n\nDIGG is led by Judy Downing — a SACAP-registered architect (PAT44740093) who holds a BSc Architecture (Hons) from the University of Pretoria and has spent over a decade working at the highest levels of the profession.\n\nHer career spans the full spectrum of architecture — from luxury coastal residences to a 300,000m² mixed-use mega-development in Cape Town. From a SAPOA award-winning office refurbishment in Johannesburg to a 14km² ultra-luxury Aman resort in Saudi Arabia, coordinated under world-renowned designer Jean-Michel Gathy. From 1,000+ group housing units to a complex international cold-storage facility where she personally eliminated over 2,000 BIM coordination clashes in under a month.\n\nShe has worked at South Africa''s leading practices — Swart & Associates, ARC Architects, Boogertman & Partners, Neo Architects, CNR Architects — across commercial, residential, industrial, retail, hospitality and government projects. What that means for you: Judy and our team bring the precision of a billion-rand project to every brief we take on, regardless of size.","alignment":"left"}},{"type":"text","data":{"heading":"The Investor Angle","body":"We don''t just design properties. We own them.\n\nSince 2016, Judy has been an active short-term rental investor in the Cape Town market. Our team understands the Airbnb platform not from a textbook but from a real P&L. We know what guests respond to, what design decisions drive occupancy, and what property investors actually need from an architect — because we are investors too.\n\nThis is the difference between a practice that tells you what''s possible and one that has personally navigated the same decisions you''re facing.","alignment":"left"}},{"type":"text","data":{"heading":"The DIGG Philosophy","body":"Develop simply. Design with purpose. Deliver value.\n\nDIGG is not here to win awards for complexity. We believe the best architectural solutions are the ones that work — financially, practically, and for the people who live and work in them. Creative thinking should produce simple, viable answers. Not overcomplicated, expensive ones.\n\nThat means designing secondary dwellings that navigate council approval efficiently. It means structuring a 160m² building to serve as four rental units or a single home, depending on what the market needs. It means giving estate agents 3D models that help properties sell faster. It means building spaces that generate returns — not just spaces that photograph well.","alignment":"left"}},{"type":"grid","data":{"title":"DIGG Credentials at a Glance","items":[{"title":"SACAP Registered Architect","description":"PAT44740093"},{"title":"BSc Architecture (Hons)","description":"University of Pretoria"},{"title":"12+ Years","description":"Professional Experience"},{"title":"International Projects","description":"South Africa, Saudi Arabia, Ghana"},{"title":"SAPOA Award Winner","description":"66 Grayston Office Refurbishment"},{"title":"Active Investors","description":"Cape Town property since 2016"},{"title":"Specialist Software","description":"Revit, BIM 360, Navisworks, Enscape, Twin Motion"}]}},{"type":"cta","data":{"title":"Ready to see what your property could be?","description":"Let''s start with a conversation. No jargon, no pressure — just an honest look at what''s possible for your property.","buttonText":"Book a Free Discovery Call","buttonLink":"/contact"}}]}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, content=EXCLUDED.content, published=EXCLUDED.published, updated_at=now();

INSERT INTO pages (slug, title, meta_title, meta_description, content, published) VALUES
('contact', 'Contact', 'Contact DIGG | Cape Town Architecture Team', 'Talk to the DIGG team about your property project. First conversation free. Call Judy on 082 707 7080.', '{"sections":[{"type":"hero","data":{"title":"Let''s Talk About Your Property.","subtitle":"Whether you''re a homeowner with a half-formed idea, an estate agent with a seller who needs plans, or an investor with a piece of land and a vision — the first conversation is always free and always worth it.","primaryCTAtext":"Contact","primaryCTAhref":"#contact-form","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},{"type":"form","data":{"formType":"contact"}},{"type":"text","data":{"heading":"Contact Details","body":"Judy Downing | Principal Architect | SACAP PAT44740093\n\nPhone: 082 707 7080\nEmail: judy@digg-ct.co.za\nLocation: Cape Town, South Africa","alignment":"center"}}]}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, content=EXCLUDED.content, published=EXCLUDED.published, updated_at=now();

INSERT INTO pages (slug, title, meta_title, meta_description, content, published) VALUES
('for-agents', 'For Agents', 'Estate Agent Partners | DIGG Architecture', 'Partner with the DIGG team to offer your sellers professional plans and 3D models as part of every listing. Cape Town estate agents welcome.', '{"sections":[{"type":"hero","data":{"title":"Give Your Sellers a Listing Nobody Else Can Offer.","subtitle":"","primaryCTAtext":"Partner With DIGG","primaryCTAhref":"#agent-form","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},{"type":"text","data":{"heading":"","body":"You already know how to sell a property. DIGG gives you something to sell that your competitors don''t have.\n\nWhen you partner with our team, your sellers get professional architectural plans and a full 3D model as part of their listing package — not a PDF floor plan from an app, but accurate, council-standard documentation that makes buyers more confident and transactions cleaner.","alignment":"left"}},{"type":"text","data":{"heading":"How It Works","body":"Step 1\nYou refer a seller who needs plans, wants to explore additions, or is preparing their property for sale or development.\n\nStep 2\nOur team handles everything: site visit, drawings, 3D render, any compliance queries. Your client gets a premium experience.\n\nStep 3\nYou get a stronger listing, a more informed buyer, and a team you can rely on for every future mandate.","alignment":"left"}},{"type":"grid","data":{"title":"What Your Clients Get","items":[{"title":"Professional As-Built Drawings","description":"Accurate documentation of their existing property"},{"title":"3D Model","description":"Showing buyers exactly what they''re purchasing — and what''s possible"},{"title":"Expert Development Advice","description":"On development potential, rezoning, or additional income streams"},{"title":"SACAP-Registered Team","description":"The same rigour we brought to multi-billion rand developments"}]}},{"type":"form","data":{"formType":"agent"}}]}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, content=EXCLUDED.content, published=EXCLUDED.published, updated_at=now();

INSERT INTO pages (slug, title, meta_title, meta_description, content, published) VALUES
('give', 'Give', 'Community | DIGG Architecture Cape Town', 'DIGG gives back through student mentorship, SME support, urban activation at Echium Park, and community gardening.', '{"sections":[{"type":"hero","data":{"title":"Because Architecture Should Serve More Than One Client.","subtitle":"","primaryCTAtext":"Learn More","primaryCTAhref":"/insights","secondaryCTAtext":"Contact","secondaryCTAhref":"/contact","backgroundImageUrl":""}},{"type":"text","data":{"heading":"","body":"The ''G'' in DIGG is the one we''re most proud of.\n\nBuilding a successful practice is not enough on its own. From the beginning, DIGG has been committed to giving back — to the profession, to the community, and to the city we call home. These are not marketing initiatives. They are part of who we are as a team.","alignment":"left"}},{"type":"text","data":{"heading":"Initiative 1 — Student Empowerment","body":"Training the next generation — and paying them for it.\n\nArchitecture students spend years learning theory before earning a cent. We''re building a programme that changes that. We work with students to draft and document existing buildings — feeding real professional work into our network while generating real income for the students who do it. Real experience. Real revenue. No waiting.","alignment":"left"}},{"type":"text","data":{"heading":"Initiative 2 — SME Network Support","body":"Architecture for the businesses that need it most.\n\nSmall and medium businesses are the backbone of Cape Town''s economy — and often the last to get access to proper architectural support. We maintain a network to assist smaller businesses with development, maintenance, upgrades and compliance, at rates and with an approach designed for their scale.","alignment":"left"}},{"type":"text","data":{"heading":"Initiative 3 — Echium Park","body":"Making public space work for everyone.\n\nEchium Park is DIGG''s first defined urban design project — a community space with the potential to become a genuine neighbourhood asset. We''re developing plans to activate this space in a way Cape Town can be proud of. Updates to follow as the project develops.","alignment":"left"}},{"type":"text","data":{"heading":"Initiative 4 — Community Gardening","body":"Growing food. Growing community.\n\nWe''re establishing a community growing group — a practical, hands-on project that brings people together, produces food, and creates green space in an urban environment. Simple. Purposeful. Very DIGG.\n\nFollow our progress on these projects in the Insights section. We''ll document the journey honestly — including the setbacks.","alignment":"left"}}]}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, content=EXCLUDED.content, published=EXCLUDED.published, updated_at=now();

-- 6. Storage buckets for image uploads (hero, logo, team, portfolio)
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public read team-photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Auth upload hero-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload team-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update hero-images" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update team-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete hero-images" ON storage.objects FOR DELETE USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete team-photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
