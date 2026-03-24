-- Reusable saved blocks for the GrapesJS visual builder (admin only)

CREATE TABLE IF NOT EXISTS builder_snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  component JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_builder_snippets_created ON builder_snippets(created_at DESC);

ALTER TABLE builder_snippets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage builder snippets" ON builder_snippets;
CREATE POLICY "Admins can manage builder snippets"
  ON builder_snippets FOR ALL
  USING (auth.role() = 'authenticated');
