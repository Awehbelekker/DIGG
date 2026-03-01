-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"sections": []}'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  folder TEXT NOT NULL CHECK (folder IN ('hero', 'logo', 'team', 'portfolio')),
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'agent')),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(published);
CREATE INDEX idx_images_folder ON images(folder);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_created ON form_submissions(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Pages: Public read for published pages, admin write
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Images: Public read, admin write
CREATE POLICY "Public can view images"
  ON images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage images"
  ON images FOR ALL
  USING (auth.role() = 'authenticated');

-- Site settings: Public read, admin write
CREATE POLICY "Public can view settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Form submissions: Admin only
CREATE POLICY "Admins can view submissions"
  ON form_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (true);
