-- Mockup-aligned page content defaults (home, about, contact)

UPDATE pages SET content = '{
  "sections": [
    {
      "type": "hero",
      "data": {
        "eyebrow": "Property · Development · Architecture",
        "title": "We design buildings like the",
        "emphasisWord": "investments",
        "subtitle": "DIGG is a Cape Town property development & architecture practice. Twelve years of experience, an investor''s mindset, and a small team that actually does the work.",
        "primaryCTAtext": "See our work →",
        "primaryCTAhref": "/insights",
        "secondaryCTAtext": "Meet the team",
        "secondaryCTAhref": "/about",
        "backgroundImageUrl": ""
      }
    },
    {
      "type": "marquee",
      "data": {
        "items": [
          { "word": "Develop" },
          { "word": "Invest" },
          { "word": "Grow" },
          { "word": "Give" }
        ]
      }
    },
    {
      "type": "services",
      "data": {
        "kick": "What we do",
        "title": "Four services. Plain language.",
        "side": "No jargon — just clarity on how we help you move from idea to built reality.",
        "items": [
          { "title": "Development advisory", "description": "Early guidance on feasibility, budgets, and design direction — before you commit capital.", "icon": "📐" },
          { "title": "Architectural design", "description": "From concept through council-ready drawings. Grounded in buildability, not just aesthetics.", "icon": "📊" },
          { "title": "Investment property solutions", "description": "Design weighed against rental yield, occupancy, and long-term value — because we invest too.", "icon": "🏗️" },
          { "title": "Principal agent", "description": "We manage the project on your behalf. Sporty.TV — 597m² delivered at Century City — is a recent example.", "icon": "🔑" }
        ]
      }
    },
    {
      "type": "work_cards",
      "data": {
        "kick": "Recent work",
        "title": "Projects on the ground",
        "sideLinkText": "View all work →",
        "sideLinkHref": "/insights",
        "items": [
          { "title": "Sporty.TV fitout", "description": "597m² commercial fitout at Century City. Principal agent — delivered.", "link": "/insights/sporty-tv-century-city", "status": "Complete", "gradientKey": "terra" },
          { "title": "HPC", "description": "Commercial project in progress. Principal agent role.", "link": "/insights/hpc", "status": "On site", "gradientKey": "navy" },
          { "title": "Atlantic Foods", "description": "Starting soon. Details to follow.", "link": "/insights", "status": "Starting soon", "gradientKey": "sage" },
          { "title": "Richmond Park", "description": "Mixed-use development — design and delivery at scale.", "link": "/insights", "gradientKey": "coral" }
        ]
      }
    },
    {
      "type": "stats",
      "data": {
        "items": [
          { "label": "Years in practice", "value": "12+" },
          { "label": "Largest single project", "value": "300,000m²" },
          { "label": "Residential units delivered", "value": "1,000+" },
          { "label": "SACAP registered", "value": "PAT44740093" }
        ]
      }
    },
    {
      "type": "cta",
      "data": {
        "kick": "Ready when you are",
        "title": "Let''s talk about your project.",
        "description": "Browse the work, read a piece or two, and get in touch when you are ready. A short message is enough.",
        "buttonText": "Contact us",
        "buttonLink": "/contact"
      }
    }
  ]
}'::jsonb,
updated_at = now()
WHERE slug = 'home' AND editor_type = 'sections';

UPDATE pages SET content = '{
  "sections": [
    {
      "type": "about_hero",
      "data": {
        "kick": "About DIGG",
        "title": "A small, hands-on team\nwith deep experience.",
        "body": "DIGG the company is young. Judy the practitioner is not. We lead with depth of experience and stay honest about being a team you deal with directly.\n\nTwelve years across every scale — luxury coastal residences, Richmond Park, a 300,000m² mixed-use development in Cape Town, and the Wadi Safar / Aman resort in Saudi Arabia.\n\nSince 2016 Judy has also been an active property investor in Cape Town — we bring an investor''s lens because we use one ourselves.",
        "portraitImageUrl": ""
      }
    },
    {
      "type": "pillars_interactive",
      "data": {
        "kick": "Our pillars",
        "title": "Develop. Invest. Grow. Give.",
        "intro": "Hover each letter to see what it means for how we work.",
        "items": [
          { "letter": "D", "title": "Develop", "description": "Development advisory and architectural design — from first sketch to council submission.", "colorKey": "terra" },
          { "letter": "I", "title": "Invest", "description": "An investor''s lens on every decision. We weigh design against yield, occupancy, and long-term value.", "colorKey": "navy" },
          { "letter": "G", "title": "Grow", "description": "Long-term value for clients and community — buildings that perform over decades, not just on handover.", "colorKey": "sage" },
          { "letter": "G", "title": "Give", "description": "Contributing back — beyond the balance sheet. Mentorship, community, and craft.", "colorKey": "coral" }
        ]
      }
    },
    {
      "type": "team",
      "data": {
        "kick": "Team Downing",
        "title": "The people you deal with",
        "members": [
          { "name": "Judy Downing", "role": "Founder | Design Architect", "credential": "Professional Architectural Technologist (SACAP PAT44740093)", "initials": "JD" },
          { "name": "Richard Downing", "role": "Operations & project delivery", "initials": "RD" },
          { "name": "Nolo", "role": "Work feed & project documentation", "initials": "N" }
        ]
      }
    },
    {
      "type": "pillars_panel",
      "data": {
        "kick": "The practice",
        "title": "Property. Development. Architecture.",
        "body": "We are based in Bloubergstrand, Cape Town. SACAP registered. Twelve years of practice. 1,000+ residential units delivered. SAPOA award-winning work."
      }
    },
    {
      "type": "cta",
      "data": {
        "kick": "Next step",
        "title": "Ready when you are.",
        "description": "Browse the work first — get in touch when it feels right.",
        "buttonText": "Contact us",
        "buttonLink": "/contact"
      }
    }
  ]
}'::jsonb,
updated_at = now()
WHERE slug = 'about' AND editor_type = 'sections';

UPDATE pages SET content = '{
  "sections": [
    {
      "type": "contact_layout",
      "data": {
        "kick": "Contact",
        "title": "Let''s talk about your property.",
        "intro": "The first conversation is always free — and always worth it.\n\nWhether you''re a homeowner with a half-formed idea, an agent with a seller who needs plans, or an investor with land and a vision — start here.\n\nTell us a little about your property or project and we''ll come back to you. No obligation, no jargon — just a straight conversation about what''s possible.",
        "submitText": "Send message",
        "reassurance": "A short note is enough. We''ll come back to you within a day or two.",
        "formAnchorId": "contact-form"
      }
    }
  ]
}'::jsonb,
updated_at = now()
WHERE slug = 'contact' AND editor_type = 'sections';

INSERT INTO site_settings (key, value) VALUES
  ('nav_cta_text', '"Let''s talk"'),
  ('work_page_kick', '"Work"'),
  ('work_page_title', '"Projects & insights"'),
  ('work_page_intro', '"A single feed of project writeups and short pieces on development and investment. Real projects, plain language."'),
  ('site_name', '"digg"')
ON CONFLICT (key) DO NOTHING;
