import type { PageSection } from '@/lib/types/database'
import type { SiteSettings } from '@/lib/site-settings'
import { HOME_PAGE_SECTIONS } from '@/lib/home-content'
import { ABOUT_PAGE_SECTIONS } from '@/lib/about-content'
import { CONTACT_PAGE_SECTIONS } from '@/lib/contact-content'
import { isBuiltinPageSlug, type BuiltinPageSlug } from '@/lib/builtin-pages'
import { mergeSectionsWithCodeDefaults } from '@/lib/merge-section-defaults'

function codeDefaults(slug: BuiltinPageSlug): PageSection[] {
  switch (slug) {
    case 'home':
      return JSON.parse(JSON.stringify(HOME_PAGE_SECTIONS)) as PageSection[]
    case 'about':
      return JSON.parse(JSON.stringify(ABOUT_PAGE_SECTIONS)) as PageSection[]
    case 'contact':
      return JSON.parse(JSON.stringify(CONTACT_PAGE_SECTIONS)) as PageSection[]
  }
}

/** DB rows seeded before the mockup rebuild still win unless we detect legacy section shapes. */
function isLegacyBuiltinSections(slug: BuiltinPageSlug, sections: PageSection[]): boolean {
  const types = new Set(sections.map((s) => s.type))
  switch (slug) {
    case 'home':
      return !types.has('marquee') || !types.has('services') || !types.has('work_cards')
    case 'about':
      return !types.has('about_hero') || !types.has('pillars_interactive')
    case 'contact':
      return !types.has('contact_layout')
    default:
      return false
  }
}

type WorkCardItem = {
  title: string
  description: string
  link?: string
  comingSoon?: boolean
  status?: string
  imageUrl?: string
  gradientKey?: string
}

function mapHomepageProducts(items: SiteSettings['homepage_products']): WorkCardItem[] | null {
  if (!items?.length) return null
  const gradients = ['terra', 'navy', 'sage', 'coral'] as const
  return items.map((p, i) => ({
    title: p.title,
    description: p.description,
    link: p.link,
    comingSoon: p.comingSoon,
    status: p.comingSoon ? 'Starting soon' : undefined,
    imageUrl: p.imageUrl,
    gradientKey: gradients[i % gradients.length],
  }))
}

/** Layer global Settings overrides onto resolved sections (home-focused). */
export function applySiteSettingsToSections(
  slug: string,
  sections: PageSection[],
  settings: SiteSettings
): PageSection[] {
  const workItems = slug === 'home' ? mapHomepageProducts(settings.homepage_products) : null

  return sections.map((section) => {
    const d = { ...section.data }

    if (section.type === 'hero') {
      if (slug === 'home') {
        const isMockupHero = Boolean(d.emphasisWord)
        // Old settings hero_title breaks mockup split headline — only override legacy heroes
        if (settings.hero_title?.trim() && !isMockupHero) {
          d.title = settings.hero_title.trim()
        }
        if (settings.hero_subtitle?.trim()) d.subtitle = settings.hero_subtitle.trim()
        if (settings.hero_primary_cta_text?.trim()) d.primaryCTAtext = settings.hero_primary_cta_text.trim()
        if (settings.hero_primary_cta_href?.trim()) d.primaryCTAhref = settings.hero_primary_cta_href.trim()
        if (settings.hero_secondary_cta_text !== undefined) d.secondaryCTAtext = settings.hero_secondary_cta_text.trim()
        if (settings.hero_secondary_cta_href?.trim()) d.secondaryCTAhref = settings.hero_secondary_cta_href.trim()
      }
      if (settings.hero_image_url?.trim() && slug === 'home') {
        d.backgroundImageUrl = settings.hero_image_url.trim()
      }
    }

    if (section.type === 'work_cards' && slug === 'home') {
      if (settings.products_heading?.trim()) d.title = settings.products_heading.trim()
      if (settings.products_intro?.trim()) d.kick = settings.products_intro.trim()
      // Page editor cards are source of truth — do not replace with Settings → Homepage products
    }

    if (section.type === 'products' && slug === 'home') {
      if (settings.products_heading?.trim()) d.title = settings.products_heading.trim()
      if (settings.products_intro?.trim()) d.subtitle = settings.products_intro.trim()
      if (workItems?.length) d.items = workItems
    }

    return { ...section, data: d }
  })
}

/**
 * Resolve public page sections: DB content when present and mockup-current, else code defaults.
 * Legacy DB seeds (pre-mockup section types) fall back to code defaults so deploys show new UI
 * even before migration 017 is applied in Supabase.
 */
export function resolvePageSections(
  slug: string,
  dbSections: PageSection[] | null | undefined,
  settings: SiteSettings = {}
): PageSection[] {
  const hasDb = Array.isArray(dbSections) && dbSections.length > 0

  let sections: PageSection[]
  if (isBuiltinPageSlug(slug)) {
    const builtinSlug = slug as BuiltinPageSlug
    const useDb = hasDb && !isLegacyBuiltinSections(builtinSlug, dbSections as PageSection[])
    sections = useDb
      ? (JSON.parse(JSON.stringify(dbSections)) as PageSection[])
      : codeDefaults(builtinSlug)
  } else {
    sections = hasDb ? (JSON.parse(JSON.stringify(dbSections)) as PageSection[]) : []
  }

  if (isBuiltinPageSlug(slug)) {
    sections = mergeSectionsWithCodeDefaults(sections)
  }

  return applySiteSettingsToSections(slug, sections, settings)
}

export function defaultSectionsForSlug(slug: string): PageSection[] | null {
  if (!isBuiltinPageSlug(slug)) return null
  return codeDefaults(slug)
}
