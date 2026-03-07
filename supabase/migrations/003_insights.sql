-- Insights (blog/articles) for SEO and authority
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_insights_slug ON insights(slug);
CREATE INDEX idx_insights_published ON insights(published);
CREATE INDEX idx_insights_updated ON insights(updated_at DESC);

CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published insights"
  ON insights FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage insights"
  ON insights FOR ALL
  USING (auth.role() = 'authenticated');
