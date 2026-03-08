import type { PageSection } from './types/database'
import { createEmptySection } from './section-config'

export interface PageTemplate {
  name: string
  icon: string
  sections: PageSection[]
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    name: 'Landing page',
    icon: '🚀',
    sections: [
      createEmptySection('hero'),
      createEmptySection('text'),
      createEmptySection('grid'),
      createEmptySection('stats'),
      createEmptySection('cta'),
    ],
  },
  {
    name: 'About',
    icon: '👥',
    sections: [
      createEmptySection('hero'),
      createEmptySection('two_column'),
      createEmptySection('testimonial'),
      createEmptySection('stats'),
      createEmptySection('cta'),
    ],
  },
  {
    name: 'Services',
    icon: '🛠',
    sections: [
      createEmptySection('hero'),
      createEmptySection('products'),
      createEmptySection('faq'),
      createEmptySection('cta'),
    ],
  },
  {
    name: 'Portfolio',
    icon: '🎨',
    sections: [
      createEmptySection('hero'),
      createEmptySection('gallery'),
      createEmptySection('text'),
      createEmptySection('cta'),
    ],
  },
  {
    name: 'Contact',
    icon: '✉️',
    sections: [
      createEmptySection('hero'),
      createEmptySection('text'),
      createEmptySection('form'),
    ],
  },
  {
    name: 'Blank',
    icon: '📄',
    sections: [],
  },
]
