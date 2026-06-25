import type { PageSection } from '@/lib/types/database'
import { COMPANY_LINE, JUDY_CREDENTIAL, JUDY_TITLE } from '@/lib/brand'

/** Contact page — Technical Brief §06 */
export const CONTACT_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'hero',
    data: {
      title: "Let's talk about your property.",
      subtitle:
        "The first conversation is always free — and always worth it.\n\nWhether you're a homeowner with a half-formed idea, an agent with a seller who needs plans, or an investor with land and a vision — start here.\n\nTell us a little about your property or project and we'll come back to you. No obligation, no jargon — just a straight conversation about what's possible.",
      primaryCTAtext: '',
      primaryCTAhref: '#contact-form',
      secondaryCTAtext: '',
      secondaryCTAhref: '',
      backgroundImageUrl: '',
    },
  },
  {
    type: 'contact_details',
    data: {},
  },
  {
    type: 'form',
    data: { formType: 'contact', anchorId: 'contact-form' },
  },
  {
    type: 'text',
    data: {
      heading: '',
      body: `Judy Downing · ${JUDY_TITLE}\n${JUDY_CREDENTIAL}\n\n${COMPANY_LINE}`,
      alignment: 'center',
    },
  },
]
