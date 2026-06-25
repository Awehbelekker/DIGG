import type { PageSection } from '@/lib/types/database'
import type { SiteSettings } from '@/lib/site-settings'
import { HOME_PAGE_SECTIONS } from '@/lib/home-content'
import { ABOUT_PAGE_SECTIONS } from '@/lib/about-content'
import { CONTACT_PAGE_SECTIONS } from '@/lib/contact-content'
import { isBuiltinPageSlug, type BuiltinPageSlug } from '@/lib/builtin-pages'

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

type ProductItem = {
  title: string
  description: string
  link?: string
  comingSoon?: boolean
  status?: string
  imageUrl?: string
}

function mapHomepageProducts(
  items: SiteSettings['homepage_products']
): ProductItem[] | null {
  if (!items?.length) return null
  return items.map((p) => ({
    title: p.title,
    description: p.description,
    link: p.link,
    comingSoon: p.comingSoon,
    status: p.comingSoon ? 'Starting soon' : undefined,
    imageUrl: p.imageUrl,
  }))
}

/** Layer global Settings overrides onto resolved sections (home-focused). */
export function applySiteSettingsToSections(
  slug: string,
  sections: PageSection[],
  settings: SiteSettings
): PageSection[] {
  const productItems = slug === 'home' ? mapHomepageProducts(settings.homepage_products) : null

  return sections.map((section) => {
    const d = { ...section.data }

    if (section.type === 'hero') {
      if (slug === 'home' || slug === 'about' || slug === 'contact') {
        if (settings.hero_title?.trim() && slug === 'home') d.title = settings.hero_title.trim()
        if (settings.hero_subtitle?.trim() && slug === 'home') d.subtitle = settings.hero_subtitle.trim()
        if (settings.hero_primary_cta_text?.trim() && slug === 'home') {
          d.primaryCTAtext = settings.hero_primary_cta_text.trim()
        }
        if (settings.hero_primary_cta_href?.trim() && slug === 'home') {
          d.primaryCTAhref = settings.hero_primary_cta_href.trim()
        }
        if (settings.hero_secondary_cta_text !== undefined && slug === 'home') {
          d.secondaryCTAtext = settings.hero_secondary_cta_text.trim()
        }
        if (settings.hero_secondary_cta_href?.trim() && slug === 'home') {
          d.secondaryCTAhref = settings.hero_secondary_cta_href.trim()
        }
      }
      if (settings.hero_image_url?.trim() && slug === 'home') {
        d.backgroundImageUrl = settings.hero_image_url.trim()
      }
    }

    if (section.type === 'products' && slug === 'home') {
      if (settings.products_heading?.trim()) d.title = settings.products_heading.trim()
      if (settings.products_intro?.trim()) d.subtitle = settings.products_intro.trim()
      if (productItems?.length) d.items = productItems
    }

    if (section.type === 'cta' && slug === 'home') {
      // optional future settings keys
    }

    return { ...section, data: d }
  })
}

/**
 * Resolve public page sections: DB content when present, else code defaults for built-in pages.
 * Settings overrides apply on top (hero image, homepage products, etc.).
 */
export function resolvePageSections(
  slug: string,
  dbSections: PageSection[] | null | undefined,
  settings: SiteSettings = {}
): PageSection[] {
  const hasDb = Array.isArray(dbSections) && dbSections.length > 0

  let sections: PageSection[]
  if (isBuiltinPageSlug(slug)) {
    sections = hasDb
      ? (JSON.parse(JSON.stringify(dbSections)) as PageSection[])
      : codeDefaults(slug)
  } else {
    sections = hasDb ? (JSON.parse(JSON.stringify(dbSections)) as PageSection[]) : []
  }

  return applySiteSettingsToSections(slug, sections, settings)
}

export function defaultSectionsForSlug(slug: string): PageSection[] | null {
  if (!isBuiltinPageSlug(slug)) return null
  return codeDefaults(slug)
}
