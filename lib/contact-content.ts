import type { PageSection } from '@/lib/types/database'
import { COMPANY_LINE, JUDY_CREDENTIAL, JUDY_TITLE } from '@/lib/brand'

/** Contact page — Technical Brief §06 */
export const CONTACT_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'hero',
    data: {
      title: "Let's talk about your project.",
      subtitle:
        'A short message is enough. No pressure — we\'ll come back to you within a day or two.',
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
