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

-- 5. Seed About, Contact, For Agents, Give as editable CMS pages (run once)
INSERT INTO pages (slug, title, content, published) VALUES
('about', 'About', '{"sections":[{"type":"hero","data":{"title":"The Team That Has Skin in the Game.","subtitle":"","primaryCTAtext":"See What We Do","primaryCTAhref":"#products","secondaryCTAtext":"Talk to Our Team","secondaryCTAhref":"/contact","backgroundImageUrl":""}},{"type":"text","data":{"heading":"About","body":"Edit this content in Admin → Pages → About. Add more sections to tell your story.","alignment":"left"}}]}'::jsonb, true),
('contact', 'Contact', '{"sections":[{"type":"hero","data":{"title":"Let''s Talk About Your Property.","subtitle":"The first conversation is always free.","primaryCTAtext":"Contact","primaryCTAhref":"/contact","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},{"type":"form","data":{"formType":"contact"}},{"type":"text","data":{"heading":"Contact Details","body":"Edit this in Admin → Pages → Contact. Add your name, phone, and email.","alignment":"center"}}]}'::jsonb, true),
('for-agents', 'For Agents', '{"sections":[{"type":"hero","data":{"title":"Give Your Sellers a Listing Nobody Else Can Offer.","subtitle":"","primaryCTAtext":"Partner With DIGG","primaryCTAhref":"/contact","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},{"type":"text","data":{"heading":"How It Works","body":"Edit this in Admin → Pages → For Agents. Add your value proposition and steps.","alignment":"left"}},{"type":"form","data":{"formType":"agent"}}]}'::jsonb, true),
('give', 'Give', '{"sections":[{"type":"hero","data":{"title":"Because Architecture Should Serve More Than One Client.","subtitle":"","primaryCTAtext":"Learn More","primaryCTAhref":"/insights","secondaryCTAtext":"Contact","secondaryCTAhref":"/contact","backgroundImageUrl":""}},{"type":"text","data":{"heading":"Community & Giving","body":"Edit this in Admin → Pages → Give. Share your initiatives and how you give back.","alignment":"left"}}]}'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;
