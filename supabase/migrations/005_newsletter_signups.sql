-- Newsletter signups (e.g. footer form)
CREATE TABLE newsletter_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_newsletter_signups_email ON newsletter_signups(LOWER(email));
CREATE INDEX idx_newsletter_signups_created ON newsletter_signups(created_at DESC);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert newsletter signups"
  ON newsletter_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter signups"
  ON newsletter_signups FOR SELECT
  USING (auth.role() = 'authenticated');
