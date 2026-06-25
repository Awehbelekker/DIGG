-- Default brand colours (DIGG Design & Voice Guide)
INSERT INTO site_settings (key, value) VALUES
('brand_colors', '{
  "bone": "#F4F0E8",
  "greige": "#C9C0B2",
  "ink": "#152232",
  "navy": "#172A45",
  "terracotta": "#B56244",
  "terraDeep": "#9A4F35",
  "sage": "#8A9A7B",
  "coral": "#E8624D",
  "muted": "#6B6B6B"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
