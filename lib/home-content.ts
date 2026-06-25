import type { PageSection } from '@/lib/types/database'

/** Homepage sections — mockup-aligned */
export const HOME_PAGE_SECTIONS: PageSection[] = [
  {
    type: 'hero',
    data: {
      eyebrow: 'Property · Development · Architecture',
      title: 'We design buildings like the',
      emphasisWord: 'investments',
      subtitle:
        "DIGG is a Cape Town property development & architecture practice. Twelve years of experience, an investor's mindset, and a small team that actually does the work.",
      primaryCTAtext: 'See our work →',
      primaryCTAhref: '/insights',
      secondaryCTAtext: 'Meet the team',
      secondaryCTAhref: '/about',
      backgroundImageUrl: '',
    },
  },
  {
    type: 'marquee',
    data: {
      items: [
        { kind: 'word', text: 'Develop' },
        { kind: 'word', text: 'Invest' },
        { kind: 'word', text: 'Grow' },
        { kind: 'word', text: 'Give' },
      ],
      speed: 'normal',
      direction: 'left',
      pauseOnHover: false,
      feedMode: 'titles',
      feedLimit: 8,
    },
  },
  {
    type: 'services',
    data: {
      kick: 'What we do',
      title: 'Four services. Plain language.',
      side: 'No jargon — just clarity on how we help you move from idea to built reality.',
      items: [
        {
          title: 'Development advisory',
          description:
            'Early guidance on feasibility, budgets, and design direction — before you commit capital.',
          icon: '📐',
        },
        {
          title: 'Architectural design',
          description:
            'From concept through council-ready drawings. Grounded in buildability, not just aesthetics.',
          icon: '📊',
        },
        {
          title: 'Investment property solutions',
          description:
            'Design weighed against rental yield, occupancy, and long-term value — because we invest too.',
          icon: '🏗️',
        },
        {
          title: 'Principal agent',
          description:
            'We manage the project on your behalf. Sporty.TV — 597m² delivered at Century City — is a recent example.',
          icon: '🔑',
        },
      ],
    },
  },
  {
    type: 'work_cards',
    data: {
      kick: 'Recent work',
      title: 'Projects on the ground',
      sideLinkText: 'View all work →',
      sideLinkHref: '/insights',
      items: [
        {
          title: 'Sporty.TV fitout',
          description: '597m² commercial fitout at Century City. Principal agent — delivered.',
          link: '/insights/sporty-tv-century-city',
          status: 'Complete',
          gradientKey: 'terra',
        },
        {
          title: 'HPC',
          description: 'Commercial project in progress. Principal agent role.',
          link: '/insights/hpc',
          status: 'On site',
          gradientKey: 'navy',
        },
        {
          title: 'Atlantic Foods',
          description: 'Starting soon. Details to follow.',
          link: '/insights',
          status: 'Starting soon',
          gradientKey: 'sage',
        },
        {
          title: 'Richmond Park',
          description: 'Mixed-use development — design and delivery at scale.',
          link: '/insights',
          gradientKey: 'coral',
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
        { label: 'PAT44740093', value: 'SACAP' },
      ],
    },
  },
  {
    type: 'cta',
    data: {
      kick: 'Ready when you are',
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
