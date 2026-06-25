-- Technical brief alignment: Work feed fields, sample projects, unpublish extra pages

ALTER TABLE insights ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'insight';
ALTER TABLE insights ADD COLUMN IF NOT EXISTS project_status TEXT;

-- Constrain values when present (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'insights_content_type_check'
  ) THEN
    ALTER TABLE insights ADD CONSTRAINT insights_content_type_check
      CHECK (content_type IN ('project', 'insight'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'insights_project_status_check'
  ) THEN
    ALTER TABLE insights ADD CONSTRAINT insights_project_status_check
      CHECK (project_status IS NULL OR project_status IN ('complete', 'on_site', 'starting_soon'));
  END IF;
END $$;

UPDATE insights SET content_type = 'project', project_status = 'complete'
WHERE slug = 'sporty-tv-century-city';

UPDATE insights SET content_type = 'project', project_status = 'on_site'
WHERE slug = 'hpc';

-- Hide pages outside the 4-page sitemap
UPDATE pages SET published = false, updated_at = now()
WHERE slug IN ('for-agents', 'give');
