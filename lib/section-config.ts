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
  { type: 'contact_details', label: 'Contact details' },
  { type: 'marquee', label: 'Marquee strip' },
  { type: 'services', label: 'Services grid' },
  { type: 'work_cards', label: 'Work card grid' },
  { type: 'about_hero', label: 'About hero' },
  { type: 'team', label: 'Team grid' },
  { type: 'pillars_interactive', label: 'Pillars (interactive)' },
  { type: 'pillars_panel', label: 'Pillars panel' },
  { type: 'contact_layout', label: 'Contact layout' },
]

export const DEFAULT_SECTION_DATA: Record<SectionType, Record<string, unknown>> = {
  hero: {
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
      { question: 'What services do you offer?', answer: 'Development advisory, architectural design, investment property solutions, and principal agent work — across Cape Town and surrounds.' },
      { question: 'How do I get started?', answer: 'Contact us through the form on our contact page and we\'ll schedule a consultation.' },
    ],
  },
  cta: {
    kick: 'Ready when you are',
    title: "Let's talk about your project.",
    description: 'Browse the work and get in touch when you are ready.',
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
  contact_details: {},
  marquee: {
    items: [
      { kind: 'word', text: 'Develop' },
      { kind: 'word', text: 'Invest' },
      { kind: 'word', text: 'Grow' },
      { kind: 'word', text: 'Give' },
      { kind: 'phrase', text: 'Build for the long term' },
      { kind: 'phrase', text: 'Design like an investor' },
    ],
    speed: 'normal',
    direction: 'left',
    pauseOnHover: false,
    feedMode: 'titles',
    feedLimit: 8,
  },
  services: {
    kick: 'What we do',
    title: 'Four services. Plain language.',
    side: 'No jargon.',
    cardLayout: 'top',
    items: [
      { title: 'Service one', description: 'Description.', icon: '📐', mediaMode: 'auto' },
      { title: 'Service two', description: 'Description.', icon: '📊', mediaMode: 'auto' },
      { title: 'Service three', description: 'Description.', icon: '🏗️', mediaMode: 'auto' },
      { title: 'Service four', description: 'Description.', icon: '🔑', mediaMode: 'auto' },
    ],
  },
  work_cards: {
    kick: 'Recent work',
    title: 'Projects on the ground',
    sideLinkText: 'View all work →',
    sideLinkHref: '/insights',
    items: [
      { title: 'Project one', description: 'Description.', link: '/insights', status: 'Complete', gradientKey: 'terra' },
      { title: 'Project two', description: 'Description.', link: '/insights', status: 'On site', gradientKey: 'navy' },
    ],
  },
  about_hero: {
    kick: 'About',
    title: 'About headline',
    body: 'Body copy.',
    portraitImageUrl: '',
  },
  team: {
    kick: 'Team',
    title: 'The team',
    members: [{ name: 'Name', role: 'Role', credential: '', photoUrl: '', initials: 'AB' }],
  },
  pillars_interactive: {
    kick: 'Our pillars',
    title: 'Develop. Invest. Grow. Give.',
    intro: 'Hover each letter.',
    items: [
      { letter: 'D', title: 'Develop', description: 'Description.', colorKey: 'terra' },
      { letter: 'I', title: 'Invest', description: 'Description.', colorKey: 'navy' },
      { letter: 'G', title: 'Grow', description: 'Description.', colorKey: 'sage' },
      { letter: 'G', title: 'Give', description: 'Description.', colorKey: 'coral' },
    ],
  },
  pillars_panel: {
    kick: 'The practice',
    title: 'Property. Development. Architecture.',
    body: 'Practice summary.',
  },
  contact_layout: {
    kick: 'Contact',
    title: "Let's talk about your property.",
    intro: 'Intro copy.',
    submitText: 'Send message',
    reassurance: "We'll come back to you within a day or two.",
    formAnchorId: 'contact-form',
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

export { HOME_PAGE_SECTIONS } from './home-content'
