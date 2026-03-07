import type { PageSection } from './types/database'

export const SECTION_TYPES: { type: PageSection['type']; label: string }[] = [
  { type: 'hero', label: 'Hero' },
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'grid', label: 'Feature grid' },
  { type: 'stats', label: 'Stats' },
  { type: 'products', label: 'Products' },
  { type: 'cta', label: 'Call to action' },
  { type: 'form', label: 'Form' },
]

export const DEFAULT_SECTION_DATA: Record<PageSection['type'], Record<string, unknown>> = {
  hero: {
    title: 'Your Property Should Be Working Harder.',
    subtitle: 'Great design should generate real returns. We help property owners unlock the potential inside their buildings and land.',
    primaryCTAtext: 'See What We Do',
    primaryCTAhref: '#products',
    secondaryCTAtext: 'Talk to Our Team',
    secondaryCTAhref: '/contact',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
  },
  text: {
    heading: 'Section heading',
    body: 'Add your content here. You can use multiple paragraphs.',
    alignment: 'left',
  },
  image: {
    imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    alt: 'Architecture and property',
    caption: '',
    layout: 'contained',
  },
  grid: {
    title: 'Features',
    items: [
      { title: 'Feature one', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80' },
      { title: 'Feature two', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
      { title: 'Feature three', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80' },
    ],
  },
  stats: {
    items: [
      { label: 'Projects', value: '50+' },
      { label: 'Years', value: '10' },
      { label: 'Clients', value: '100+' },
    ],
  },
  products: {
    title: 'Our products',
    subtitle: 'Choose your starting point.',
    items: [
      { title: 'Product one', description: 'Description.', link: '', comingSoon: false, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80' },
      { title: 'Product two', description: 'Description.', link: '', comingSoon: false, imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
    ],
  },
  cta: {
    title: 'Ready to get started?',
    description: 'Talk to our team about your project.',
    buttonText: 'Contact us',
    buttonLink: '/contact',
  },
  form: {
    formType: 'contact',
  },
}

export function createEmptySection(type: PageSection['type']): PageSection {
  return {
    type,
    data: { ...DEFAULT_SECTION_DATA[type] },
  }
}

/** Recommended starting sections for a new page (Hero, intro text, image, more text, CTA). */
export function getRecommendedStartingSections(): PageSection[] {
  return [
    createEmptySection('hero'),
    createEmptySection('text'),
    createEmptySection('image'),
    {
      type: 'text',
      data: {
        heading: 'Another section',
        body: 'Add more content here. You can replace or remove any section.',
        alignment: 'left',
      },
    },
    createEmptySection('cta'),
  ]
}
