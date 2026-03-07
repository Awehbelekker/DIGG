import type { PageSection } from './types/database'

export const SECTION_TYPES: { type: PageSection['type']; label: string }[] = [
  { type: 'hero', label: 'Hero' },
  { type: 'text', label: 'Text' },
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
    backgroundImageUrl: '',
  },
  text: {
    heading: 'Section heading',
    body: 'Add your content here. You can use multiple paragraphs.',
    alignment: 'left',
  },
  grid: {
    title: 'Features',
    items: [
      { title: 'Feature one', description: 'Short description.', imageUrl: '' },
      { title: 'Feature two', description: 'Short description.', imageUrl: '' },
      { title: 'Feature three', description: 'Short description.', imageUrl: '' },
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
      { title: 'Product one', description: 'Description.', link: '', comingSoon: false },
      { title: 'Product two', description: 'Description.', link: '', comingSoon: false },
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
