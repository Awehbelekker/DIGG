-- Homepage sections per Technical Brief §03 + sample Work items for teasers

UPDATE pages SET
  meta_title = 'DIGG | Property Development & Architecture | Cape Town',
  meta_description = 'A Cape Town property development and architecture practice. Development advisory, architectural design, investment property solutions, and principal agent services.',
  content = '{
    "sections": [
      {
        "type": "hero",
        "data": {
          "title": "Design is an investment decision.",
          "subtitle": "DIGG is a property development and architecture practice in Cape Town. We bring an investor''s mindset to every project — clarity, value, and follow-through.",
          "primaryCTAtext": "See our work",
          "primaryCTAhref": "/insights",
          "secondaryCTAtext": "",
          "secondaryCTAhref": "/contact",
          "backgroundImageUrl": ""
        }
      },
      {
        "type": "grid",
        "data": {
          "title": "What we do",
          "items": [
            {"title": "Development advisory", "description": "Early guidance on feasibility, budgets, and design direction — before you commit capital."},
            {"title": "Architectural design", "description": "From concept through council-ready drawings. Grounded in buildability, not just aesthetics."},
            {"title": "Investment property solutions", "description": "Design weighed against rental yield, occupancy, and long-term value — because we invest too."},
            {"title": "Principal agent", "description": "We manage the project on your behalf. Sporty.TV — 597m² delivered at Century City — is a recent example."}
          ]
        }
      },
      {
        "type": "products",
        "data": {
          "title": "Recent work",
          "subtitle": "A glimpse of what we are building. More in the Work feed.",
          "items": [
            {"title": "Sporty.TV fitout", "description": "597m² commercial fitout at Century City. Principal agent — delivered.", "link": "/insights/sporty-tv-century-city", "status": "Complete", "imageUrl": ""},
            {"title": "HPC", "description": "Commercial project in progress. Principal agent role.", "link": "/insights/hpc", "status": "On site", "imageUrl": ""},
            {"title": "Atlantic Foods", "description": "Starting soon. Details to follow.", "link": "/insights", "status": "Starting soon", "comingSoon": true, "imageUrl": ""}
          ]
        }
      },
      {
        "type": "stats",
        "data": {
          "items": [
            {"label": "Years in practice", "value": "12+"},
            {"label": "Largest single project", "value": "300,000m²"},
            {"label": "Residential units delivered", "value": "1,000+"},
            {"label": "SACAP registered", "value": "PAT44740093"}
          ]
        }
      },
      {
        "type": "cta",
        "data": {
          "title": "Let''s talk about your project.",
          "description": "Browse the work, read a piece or two, and get in touch when you are ready. A short message is enough.",
          "buttonText": "Contact us",
          "buttonLink": "/contact"
        }
      }
    ]
  }'::jsonb,
  updated_at = now()
WHERE slug = 'home';

-- Sample Work / insight entries for homepage teasers
INSERT INTO insights (slug, title, body, published) VALUES
(
  'sporty-tv-century-city',
  'Sporty.TV fitout — Century City',
  'We managed the Sporty.TV fitout as principal agent — 597m² delivered at Century City.

DIGG handled the full principal agent role: coordinating consultants, managing the build programme, and keeping the client informed at every stage. The result is a broadcast-ready commercial space delivered on brief.

**Role:** Principal agent
**Size:** 597m²
**Location:** Century City, Cape Town
**Status:** Complete',
  true
),
(
  'hpc',
  'HPC — commercial project',
  'HPC is a commercial project currently on site. DIGG is acting as principal agent — managing delivery, coordinating the team, and protecting the client''s budget.

More detail and photography will be added as the project progresses.

**Role:** Principal agent
**Status:** On site',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  published = EXCLUDED.published,
  updated_at = now();

UPDATE site_settings SET value = '"DIGG"' WHERE key = 'site_name';
