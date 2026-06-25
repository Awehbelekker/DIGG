-- Brand & voice guide content updates (Design & Voice Guide + Technical Brief)

UPDATE pages SET
  meta_title = 'DIGG | Property Development & Architecture | Cape Town',
  meta_description = 'A Cape Town property development and architecture practice. Development advisory, architectural design, investment property solutions, and principal agent services.',
  updated_at = now()
WHERE slug = 'home';

UPDATE pages SET
  meta_title = 'About DIGG | Judy Downing & Team | Cape Town',
  meta_description = 'Meet Team Downing — a small, hands-on property development and architecture practice in Bloubergstrand, Cape Town.',
  content = jsonb_set(
    content,
    '{sections}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN elem->>'type' = 'text' AND elem->'data'->>'heading' LIKE 'Judy%'
            THEN jsonb_set(
              elem,
              '{data,heading}',
              '"Judy Downing"'::jsonb
            )
          WHEN elem->>'type' = 'text' AND elem->'data'->>'heading' = 'Judy''s Story — The Principal'
            THEN jsonb_set(
              jsonb_set(
                elem,
                '{data,heading}',
                '"Judy Downing"'::jsonb
              ),
              '{data,body}',
              to_jsonb(
                'Founder | Design Architect' || E'\n' ||
                'Professional Architectural Technologist (SACAP PAT44740093)' || E'\n\n' ||
                'Twelve years across every scale — from luxury coastal residences to a 300,000m² mixed-use development in Cape Town, a 14km² Aman resort in Saudi Arabia, and 1,000+ group housing units.' || E'\n\n' ||
                'Judy leads DIGG with an investor''s lens on every decision. Since 2016 she has been an active short-term rental investor in Cape Town — we know what property investors need because we are investors too.'
              )
            )
          ELSE elem
        END
      )
      FROM jsonb_array_elements(content->'sections') AS elem
    )
  ),
  updated_at = now()
WHERE slug = 'about' AND content ? 'sections';

UPDATE pages SET
  meta_title = 'Contact DIGG | Cape Town',
  meta_description = 'Talk to DIGG about your property project. Bloubergstrand, Cape Town. We''ll come back to you within a day or two.',
  content = jsonb_set(
    content,
    '{sections}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN elem->>'type' = 'text' AND elem->'data'->>'heading' = 'Contact Details'
            THEN jsonb_set(
              elem,
              '{data,body}',
              to_jsonb(
                'Judy Downing | Founder | Design Architect' || E'\n' ||
                'Professional Architectural Technologist (SACAP PAT44740093)' || E'\n\n' ||
                'Phone: 082 707 7080' || E'\n' ||
                'Email: judy@digg-ct.co.za' || E'\n' ||
                'Bloubergstrand, Cape Town' || E'\n\n' ||
                'Trading as Aweh Be Lekker (Pty) Ltd · Reg 2024/537986/07'
              )
            )
          ELSE elem
        END
      )
      FROM jsonb_array_elements(content->'sections') AS elem
    )
  ),
  updated_at = now()
WHERE slug = 'contact' AND content ? 'sections';
