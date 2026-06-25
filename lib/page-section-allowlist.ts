import type { SectionType } from '@/lib/types/database'
import { isBuiltinPageSlug } from '@/lib/builtin-pages'

const HOME_SECTIONS: SectionType[] = [
  'hero',
  'marquee',
  'services',
  'work_cards',
  'stats',
  'cta',
  'text',
  'grid',
  'testimonial',
  'faq',
  'divider',
  'gallery',
  'video',
]

const ABOUT_SECTIONS: SectionType[] = [
  'about_hero',
  'pillars_interactive',
  'team',
  'pillars_panel',
  'cta',
  'text',
  'grid',
  'stats',
  'testimonial',
  'faq',
  'divider',
]

const CONTACT_SECTIONS: SectionType[] = ['contact_layout', 'text', 'cta', 'form', 'contact_details', 'divider']

export function allowedSectionTypesForPage(slug: string): SectionType[] | null {
  if (slug === 'home') return HOME_SECTIONS
  if (slug === 'about') return ABOUT_SECTIONS
  if (slug === 'contact') return CONTACT_SECTIONS
  if (isBuiltinPageSlug(slug)) return null
  return null // null = all types allowed (custom pages use grapesjs anyway)
}

export function isSectionAllowedOnPage(slug: string, type: SectionType): boolean {
  const allowed = allowedSectionTypesForPage(slug)
  if (!allowed) return true
  return allowed.includes(type)
}
