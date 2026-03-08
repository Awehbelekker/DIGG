-- Seed the homepage as an editable page (slug = 'home')
-- Safe to re-run: ON CONFLICT updates the existing row.

INSERT INTO pages (slug, title, meta_title, meta_description, content, published) VALUES
('home', 'Home', 'DIGG | Cape Town Architecture & Property Design', 'DIGG is a Cape Town architecture practice built on one idea: great design should generate real returns.', '{
  "sections": [
    {
      "type": "hero",
      "data": {
        "title": "Your Property Should Be Working Harder.",
        "subtitle": "DIGG is a Cape Town architecture practice built on one idea: great design should generate real returns. We help property owners, investors and developers unlock the financial potential sitting inside their buildings and land.",
        "primaryCTAtext": "See What We Do",
        "primaryCTAhref": "#products",
        "secondaryCTAtext": "Talk to Our Team",
        "secondaryCTAhref": "/contact",
        "backgroundImageUrl": ""
      }
    },
    {
      "type": "grid",
      "data": {
        "title": "Selected Work",
        "items": [
          {"title": "Residential — Income Unit", "description": "Cape Town"},
          {"title": "Rezoning & As-Built", "description": "Western Cape"},
          {"title": "Multi-Unit Development", "description": "Cape Town"}
        ]
      }
    },
    {
      "type": "grid",
      "data": {
        "title": "",
        "items": [
          {"title": "Untapped Value", "description": "Most Cape Town properties have income potential that hasn''t been activated yet.", "imageUrl": ""},
          {"title": "Intelligent Design", "description": "We design for outcomes, not just aesthetics. Every decision is weighed against your financial return.", "imageUrl": ""},
          {"title": "Full-Service Partnership", "description": "From first sketch to council approval — our team walks the whole journey with you.", "imageUrl": ""}
        ]
      }
    },
    {
      "type": "stats",
      "data": {
        "items": [
          {"label": "Years Experience", "value": "12+"},
          {"label": "Projects Completed", "value": "50+"},
          {"label": "Active Investors", "value": "Since 2016"},
          {"label": "SACAP Registered", "value": "PAT44740093"}
        ]
      }
    },
    {
      "type": "products",
      "data": {
        "title": "Built Products. Proven Solutions.",
        "subtitle": "We''ve turned decades of large-scale architectural experience into a suite of accessible, income-generating property products. Choose your starting point.",
        "items": [
          {"title": "Airbnb-Ready Design", "description": "Turn your home into a performing short-term asset.", "comingSoon": false, "imageUrl": "", "link": ""},
          {"title": "Sky Pod", "description": "A premium office addition that pays its way.", "comingSoon": true, "imageUrl": "", "link": ""},
          {"title": "The Flex", "description": "One footprint. Four income streams. Total flexibility.", "comingSoon": true, "imageUrl": "", "link": ""},
          {"title": "Rezoning & Densification", "description": "Unlock the value your zoning is hiding.", "comingSoon": false, "imageUrl": "", "link": ""}
        ]
      }
    },
    {
      "type": "cta",
      "data": {
        "title": "Are You an Estate Agent?",
        "description": "Give your sellers something no other agent offers — professional plans and a 3D model as part of every listing. Let''s build a referral partnership that works for both of us.",
        "buttonText": "Partner With DIGG",
        "buttonLink": "/for-agents"
      }
    }
  ]
}'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  published = EXCLUDED.published,
  updated_at = now();
