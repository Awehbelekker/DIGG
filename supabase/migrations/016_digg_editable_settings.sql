-- DIGG tenant: editable settings + contact page copy (artifact-aligned)

INSERT INTO site_settings (key, value) VALUES
  ('location', '"Cape Town, South Africa"'),
  ('whatsapp_message', '"Hi DIGG, I''d like to talk about a project."'),
  ('instagram_url', '""'),
  ('linkedin_url', '""'),
  ('footer_tagline', '"DIGG is a property development and architecture practice based in Cape Town. We bring an investor''s mindset to design — clarity, value, and follow-through."'),
  ('pillars', '"Develop · Invest · Grow · Give"'),
  ('company_line', '"Trading as Aweh Be Lekker (Pty) Ltd · Reg 2024/537986/07 · Bloubergstrand, Cape Town"')
ON CONFLICT (key) DO NOTHING;

-- Contact page: artifact-aligned hero copy
UPDATE pages SET content = jsonb_set(
  content,
  '{sections}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN elem->>'type' = 'hero' THEN
          jsonb_set(
            jsonb_set(
              elem,
              '{data,title}',
              '"Let''s talk about your property."'::jsonb
            ),
            '{data,subtitle}',
            to_jsonb(
              'The first conversation is always free — and always worth it.' || E'\n\n' ||
              'Whether you''re a homeowner with a half-formed idea, an agent with a seller who needs plans, or an investor with land and a vision — start here.' || E'\n\n' ||
              'Tell us a little about your property or project and we''ll come back to you. No obligation, no jargon — just a straight conversation about what''s possible.'
            )
          )
        ELSE elem
      END
    )
    FROM jsonb_array_elements(content->'sections') AS elem
  )
)
WHERE slug = 'contact'
  AND editor_type = 'sections'
  AND content->'sections' IS NOT NULL;
