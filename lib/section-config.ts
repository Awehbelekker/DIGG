import type { PageSection, SectionType } from './types/database'

export const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: 'hero', label: 'Hero' },
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'two_column', label: 'Two columns' },
  { type: 'grid', label: 'Feature grid' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'stats', label: 'Stats' },
  { type: 'products', label: 'Products' },
  { type: 'testimonial', label: 'Testimonial' },
  { type: 'video', label: 'Video' },
  { type: 'logos', label: 'Logo strip' },
  { type: 'faq', label: 'FAQ' },
  { type: 'cta', label: 'Call to action' },
  { type: 'divider', label: 'Divider' },
  { type: 'form', label: 'Form' },
]

export const DEFAULT_SECTION_DATA: Record<SectionType, Record<string, unknown>> = {
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
  two_column: {
    heading: 'About us',
    body: 'Tell your story here. This section pairs text with an image side by side.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    imageAlt: 'About image',
    reversed: false,
  },
  grid: {
    title: 'Features',
    items: [
      { title: 'Feature one', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80' },
      { title: 'Feature two', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
      { title: 'Feature three', description: 'Short description.', imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80' },
    ],
  },
  gallery: {
    title: 'Gallery',
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80', alt: 'Image 1' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Image 2' },
      { url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80', alt: 'Image 3' },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', alt: 'Image 4' },
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
  testimonial: {
    quote: 'Working with this team transformed how we think about our property portfolio. The results speak for themselves.',
    author: 'Jane Smith',
    role: 'Property Developer',
    company: 'Smith Properties',
    photoUrl: '',
  },
  video: {
    heading: '',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: '',
  },
  logos: {
    title: 'Trusted by',
    logos: [
      { name: 'Partner 1', imageUrl: '' },
      { name: 'Partner 2', imageUrl: '' },
      { name: 'Partner 3', imageUrl: '' },
      { name: 'Partner 4', imageUrl: '' },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      { question: 'What services do you offer?', answer: 'We offer a range of architecture and property development services.' },
      { question: 'How do I get started?', answer: 'Contact us through the form on our contact page and we\'ll schedule a consultation.' },
    ],
  },
  cta: {
    title: 'Ready to get started?',
    description: 'Talk to our team about your project.',
    buttonText: 'Contact us',
    buttonLink: '/contact',
  },
  divider: {
    size: 'md',
    showLine: true,
  },
  form: {
    formType: 'contact',
  },
}

export function createEmptySection(type: SectionType): PageSection {
  return {
    type,
    data: JSON.parse(JSON.stringify(DEFAULT_SECTION_DATA[type])),
  }
}

export function getRecommendedStartingSections(): PageSection[] {
  return []
}
