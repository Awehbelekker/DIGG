-- Update pillars intro copy (no longer references hover interaction)
UPDATE pages
SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN section->>'type' = 'pillars_interactive'
        THEN jsonb_set(section, '{data,intro}', '"Four pillars that guide every project."')
        ELSE section
      END
    )
    FROM jsonb_array_elements(content->'sections') AS section
  )
)
WHERE slug = 'about'
  AND content->'sections' IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(content->'sections') AS s
    WHERE s->>'type' = 'pillars_interactive'
  );
