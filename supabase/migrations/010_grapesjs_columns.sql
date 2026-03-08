-- Add GrapesJS support columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS gjs_data JSONB;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_html TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_css TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS editor_type TEXT NOT NULL DEFAULT 'sections'
  CHECK (editor_type IN ('sections', 'grapesjs'));
