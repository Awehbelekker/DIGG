import type { PageSection } from '@/lib/types/database'

/** Default homepage sections — Technical Brief §03 */
export const HOME_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'hero',
    data: {
      title: 'Design is an investment decision.',
      subtitle:
        "DIGG is a property development and architecture practice in Cape Town. We bring an investor's mindset to every project — clarity, value, and follow-through.",
      primaryCTAtext: 'See our work',
      primaryCTAhref: '/insights',
      secondaryCTAtext: '',
      secondaryCTAhref: '/contact',
      backgroundImageUrl: '',
    },
  },
  {
    type: 'grid',
    data: {
      title: 'What we do',
      items: [
        {
          title: 'Development advisory',
          description:
            'Early guidance on feasibility, budgets, and design direction — before you commit capital.',
        },
        {
          title: 'Architectural design',
          description:
            'From concept through council-ready drawings. Grounded in buildability, not just aesthetics.',
        },
        {
          title: 'Investment property solutions',
          description:
            'Design weighed against rental yield, occupancy, and long-term value — because we invest too.',
        },
        {
          title: 'Principal agent',
          description:
            'We manage the project on your behalf. Sporty.TV — 597m² delivered at Century City — is a recent example.',
        },
      ],
    },
  },
  {
    type: 'grid',
    data: {
      title: 'Develop · Invest · Grow · Give',
      items: [
        { title: 'Develop', description: 'Development advisory and architectural design.' },
        { title: 'Invest', description: "An investor's lens on every decision." },
        { title: 'Grow', description: 'Long-term value for clients and community.' },
        { title: 'Give', description: 'Contributing back — beyond the balance sheet.' },
      ],
    },
  },
  {
    type: 'products',
    data: {
      title: 'Recent work',
      subtitle: 'A glimpse of what we are building. More in the Work feed.',
      items: [
        {
          title: 'Sporty.TV fitout',
          description: '597m² commercial fitout at Century City. Principal agent — delivered.',
          link: '/insights/sporty-tv-century-city',
          status: 'Complete',
          imageUrl: '',
        },
        {
          title: 'HPC',
          description: 'Commercial project in progress. Principal agent role.',
          link: '/insights/hpc',
          status: 'On site',
          imageUrl: '',
        },
        {
          title: 'Atlantic Foods',
          description: 'Starting soon. Details to follow.',
          link: '/insights',
          status: 'Starting soon',
          comingSoon: true,
          imageUrl: '',
        },
      ],
    },
  },
  {
    type: 'stats',
    data: {
      items: [
        { label: 'Years in practice', value: '12+' },
        { label: 'Largest single project', value: '300,000m²' },
        { label: 'Residential units delivered', value: '1,000+' },
        { label: 'SACAP registered', value: 'PAT44740093' },
      ],
    },
  },
  {
    type: 'cta',
    data: {
      title: "Let's talk about your project.",
      description:
        'Browse the work, read a piece or two, and get in touch when you are ready. A short message is enough.',
      buttonText: 'Contact us',
      buttonLink: '/contact',
    },
  },
]

export function homePageContentJson(): { sections: PageSection[] } {
  return { sections: HOME_PAGE_SECTIONS }
}
