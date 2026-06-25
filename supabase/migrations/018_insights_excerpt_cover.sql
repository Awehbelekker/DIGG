-- Work feed card fields for insights/projects

ALTER TABLE insights ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE insights ADD COLUMN IF NOT EXISTS cover_image_url text;

COMMENT ON COLUMN insights.excerpt IS 'Short summary for work feed cards';
COMMENT ON COLUMN insights.cover_image_url IS 'Cover image URL for work feed cards';
