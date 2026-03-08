-- Run this in your Supabase SQL Editor to add GrapesJS support columns
-- This is safe to run multiple times (IF NOT EXISTS)

ALTER TABLE pages ADD COLUMN IF NOT EXISTS gjs_data JSONB;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_html TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_css TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'editor_type'
  ) THEN
    ALTER TABLE pages ADD COLUMN editor_type TEXT NOT NULL DEFAULT 'sections';
    ALTER TABLE pages ADD CONSTRAINT pages_editor_type_check
      CHECK (editor_type IN ('sections', 'grapesjs'));
  END IF;
END $$;
