import type { PageSection } from '@/lib/types/database'

/** Contact page — mockup-aligned 2-column layout */
export const CONTACT_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'contact_layout',
    data: {
      kick: 'Contact',
      title: "Let's talk about your property.",
      intro:
        "The first conversation is always free — and always worth it.\n\nWhether you're a homeowner with a half-formed idea, an agent with a seller who needs plans, or an investor with land and a vision — start here.\n\nTell us a little about your property or project and we'll come back to you. No obligation, no jargon — just a straight conversation about what's possible.",
      submitText: 'Send message',
      reassurance: "A short note is enough. We'll come back to you within a day or two.",
      formAnchorId: 'contact-form',
    },
  },
]
