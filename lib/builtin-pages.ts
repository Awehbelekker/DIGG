export const BUILTIN_PAGE_SLUGS = ['home', 'about', 'contact'] as const
export type BuiltinPageSlug = (typeof BUILTIN_PAGE_SLUGS)[number]

export function isBuiltinPageSlug(slug: string): slug is BuiltinPageSlug {
  return (BUILTIN_PAGE_SLUGS as readonly string[]).includes(slug)
}

export { resolvePageSections, defaultSectionsForSlug } from '@/lib/resolve-page-sections'
