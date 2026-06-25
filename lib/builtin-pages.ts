import type { PageSection } from '@/lib/types/database'
import type { SiteSettings } from '@/lib/site-settings'
import { HOME_PAGE_SECTIONS } from '@/lib/home-content'
import { ABOUT_PAGE_SECTIONS } from '@/lib/about-content'
import { CONTACT_PAGE_SECTIONS } from '@/lib/contact-content'

export const BUILTIN_PAGE_SLUGS = ['home', 'about', 'contact'] as const
export type BuiltinPageSlug = (typeof BUILTIN_PAGE_SLUGS)[number]

export function isBuiltinPageSlug(slug: string): slug is BuiltinPageSlug {
  return (BUILTIN_PAGE_SLUGS as readonly string[]).includes(slug)
}

function baseSections(slug: BuiltinPageSlug): PageSection[] {
  switch (slug) {
    case 'home':
      return JSON.parse(JSON.stringify(HOME_PAGE_SECTIONS)) as PageSection[]
    case 'about':
      return JSON.parse(JSON.stringify(ABOUT_PAGE_SECTIONS)) as PageSection[]
    case 'contact':
      return JSON.parse(JSON.stringify(CONTACT_PAGE_SECTIONS)) as PageSection[]
  }
}

/** Apply optional homepage copy overrides from Admin → Settings. */
export function applyHomeSettings(sections: PageSection[], settings: SiteSettings): PageSection[] {
  return sections.map((section) => {
    if (section.type !== 'hero') return section
    const d = { ...section.data }
    if (settings.hero_title?.trim()) d.title = settings.hero_title.trim()
    if (settings.hero_subtitle?.trim()) d.subtitle = settings.hero_subtitle.trim()
    if (settings.hero_primary_cta_text?.trim()) d.primaryCTAtext = settings.hero_primary_cta_text.trim()
    if (settings.hero_primary_cta_href?.trim()) d.primaryCTAhref = settings.hero_primary_cta_href.trim()
    if (settings.hero_secondary_cta_text !== undefined) d.secondaryCTAtext = settings.hero_secondary_cta_text.trim()
    if (settings.hero_secondary_cta_href?.trim()) d.secondaryCTAhref = settings.hero_secondary_cta_href.trim()
    return { ...section, data: d }
  })
}

/**
 * Canonical brief-aligned sections for built-in pages.
 * Used instead of stale DB JSON unless the page is a GrapesJS custom build.
 */
export function resolveBuiltinSections(
  slug: string,
  settings: SiteSettings = {}
): PageSection[] | null {
  if (!isBuiltinPageSlug(slug)) return null
  let sections = baseSections(slug)
  if (slug === 'home') sections = applyHomeSettings(sections, settings)
  return sections
}
