import type { PageSection } from '@/lib/types/database'
import { JUDY_CREDENTIAL, JUDY_TITLE, PILLARS } from '@/lib/brand'

/** About page — Technical Brief §05 + Design & Voice Guide */
export const ABOUT_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'hero',
    data: {
      title: 'A small, hands-on team with deep experience.',
      subtitle:
        'DIGG the company is young. Judy the practitioner is not. We lead with depth of experience and stay honest about being a team you deal with directly.',
      primaryCTAtext: 'See our work',
      primaryCTAhref: '/insights',
      secondaryCTAtext: 'Contact',
      secondaryCTAhref: '/contact',
      backgroundImageUrl: '',
    },
  },
  {
    type: 'text',
    data: {
      heading: 'Team Downing',
      body: `We're a small, hands-on practice — that's a selling point, not a weakness. You deal with the people doing the work.

Judy Downing — ${JUDY_TITLE}
${JUDY_CREDENTIAL}

Richard Downing — operations and project delivery

Nolo — keeps our work feed and project documentation current`,
      alignment: 'left',
    },
  },
  {
    type: 'text',
    data: {
      heading: "Judy's portfolio",
      body: `Twelve years across every scale — luxury coastal residences, Richmond Park, a 300,000m² mixed-use development in Cape Town, and the Wadi Safar / Aman resort in Saudi Arabia (14km², coordinated under Jean-Michel Gathy).

1,000+ residential units delivered. SAPOA award-winning work. Experience across commercial, residential, industrial, retail, hospitality and government — at practices including Boogertman & Partners, Neo Architects and CNR Architects.

Since 2016 Judy has also been an active property investor in Cape Town — we bring an investor's lens because we use one ourselves.`,
      alignment: 'left',
    },
  },
  {
    type: 'grid',
    data: {
      title: PILLARS,
      items: [
        { title: 'Develop', description: 'Development advisory and architectural design.' },
        { title: 'Invest', description: "An investor's lens on every decision." },
        { title: 'Grow', description: 'Long-term value for clients and community.' },
        { title: 'Give', description: 'Contributing back — beyond the balance sheet.' },
      ],
    },
  },
  {
    type: 'grid',
    data: {
      title: 'Credentials',
      items: [
        { title: 'SACAP', description: 'PAT44740093' },
        { title: '12+ years', description: 'Professional practice' },
        { title: '1,000+ units', description: 'Group housing delivered' },
        { title: 'Cape Town', description: 'Bloubergstrand — Western Cape' },
      ],
    },
  },
  {
    type: 'cta',
    data: {
      title: 'Ready when you are.',
      description: 'Browse the work first — get in touch when it feels right.',
      buttonText: 'Contact us',
      buttonLink: '/contact',
    },
  },
]
