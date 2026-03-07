-- Optional per-page OG image for social sharing
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_og_image TEXT;
