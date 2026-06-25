import type { PageSection } from '@/lib/types/database'
import { JUDY_CREDENTIAL, JUDY_TITLE } from '@/lib/brand'

/** About page — mockup-aligned */
export const ABOUT_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'about_hero',
    data: {
      kick: 'About DIGG',
      title: 'A small, hands-on team\nwith deep experience.',
      body: `DIGG the company is young. Judy the practitioner is not. We lead with depth of experience and stay honest about being a team you deal with directly.

Twelve years across every scale — luxury coastal residences, Richmond Park, a 300,000m² mixed-use development in Cape Town, and the Wadi Safar / Aman resort in Saudi Arabia.

Since 2016 Judy has also been an active property investor in Cape Town — we bring an investor's lens because we use one ourselves.`,
      portraitImageUrl: '',
    },
  },
  {
    type: 'pillars_interactive',
    data: {
      kick: 'Our pillars',
      title: 'Develop. Invest. Grow. Give.',
      intro: 'Four pillars that guide every project.',
      items: [
        {
          letter: 'D',
          title: 'Develop',
          description: 'Development advisory and architectural design — from first sketch to council submission.',
          colorKey: 'terra',
        },
        {
          letter: 'I',
          title: 'Invest',
          description: "An investor's lens on every decision. We weigh design against yield, occupancy, and long-term value.",
          colorKey: 'navy',
        },
        {
          letter: 'G',
          title: 'Grow',
          description: 'Long-term value for clients and community — buildings that perform over decades, not just on handover.',
          colorKey: 'sage',
        },
        {
          letter: 'G',
          title: 'Give',
          description: 'Contributing back — beyond the balance sheet. Mentorship, community, and craft.',
          colorKey: 'coral',
        },
      ],
    },
  },
  {
    type: 'team',
    data: {
      kick: 'Team Downing',
      title: 'The people you deal with',
      members: [
        {
          name: 'Judy Downing',
          role: JUDY_TITLE,
          credential: JUDY_CREDENTIAL,
          initials: 'JD',
        },
        {
          name: 'Richard Downing',
          role: 'Operations & project delivery',
          initials: 'RD',
        },
        {
          name: 'Nolo',
          role: 'Work feed & project documentation',
          initials: 'N',
        },
      ],
    },
  },
  {
    type: 'pillars_panel',
    data: {
      kick: 'The practice',
      title: 'Property. Development. Architecture.',
      body: 'We are based in Bloubergstrand, Cape Town. SACAP registered. Twelve years of practice. 1,000+ residential units delivered. SAPOA award-winning work.',
    },
  },
  {
    type: 'cta',
    data: {
      kick: 'Next step',
      title: 'Ready when you are.',
      description: 'Browse the work first — get in touch when it feels right.',
      buttonText: 'Contact us',
      buttonLink: '/contact',
    },
  },
]
