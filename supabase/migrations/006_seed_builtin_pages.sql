-- Seed About, Contact, For Agents, Give as CMS pages so the tenant can edit them in Admin → Pages.
-- Run this once. Uses ON CONFLICT so safe to run again.

INSERT INTO pages (slug, title, content, published) VALUES
(
  'about',
  'About',
  '{"sections":[
    {"type":"hero","data":{"title":"The Team That Has Skin in the Game.","subtitle":"","primaryCTAtext":"See What We Do","primaryCTAhref":"#products","secondaryCTAtext":"Talk to Our Team","secondaryCTAhref":"/contact","backgroundImageUrl":""}},
    {"type":"text","data":{"heading":"About","body":"Edit this content in Admin → Pages → About. Add more sections to tell your story.","alignment":"left"}}
  ]}'::jsonb,
  true
),
(
  'contact',
  'Contact',
  '{"sections":[
    {"type":"hero","data":{"title":"Let''s Talk About Your Property.","subtitle":"Whether you''re a homeowner with a half-formed idea, an estate agent with a seller who needs plans, or an investor with a piece of land and a vision — the first conversation is always free.","primaryCTAtext":"Contact","primaryCTAhref":"/contact","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},
    {"type":"form","data":{"formType":"contact"}},
    {"type":"text","data":{"heading":"Contact Details","body":"Edit this in Admin → Pages → Contact. Add your name, phone, and email.","alignment":"center"}}
  ]}'::jsonb,
  true
),
(
  'for-agents',
  'For Agents',
  '{"sections":[
    {"type":"hero","data":{"title":"Give Your Sellers a Listing Nobody Else Can Offer.","subtitle":"","primaryCTAtext":"Partner With DIGG","primaryCTAhref":"/contact","secondaryCTAtext":"","secondaryCTAhref":"","backgroundImageUrl":""}},
    {"type":"text","data":{"heading":"How It Works","body":"Edit this in Admin → Pages → For Agents. Add your value proposition and steps.","alignment":"left"}},
    {"type":"form","data":{"formType":"agent"}}
  ]}'::jsonb,
  true
),
(
  'give',
  'Give',
  '{"sections":[
    {"type":"hero","data":{"title":"Because Architecture Should Serve More Than One Client.","subtitle":"","primaryCTAtext":"Learn More","primaryCTAhref":"/insights","secondaryCTAtext":"Contact","secondaryCTAhref":"/contact","backgroundImageUrl":""}},
    {"type":"text","data":{"heading":"Community & Giving","body":"Edit this in Admin → Pages → Give. Share your initiatives and how you give back.","alignment":"left"}}
  ]}'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;
