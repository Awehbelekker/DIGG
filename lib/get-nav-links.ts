import { createClient } from '@/lib/supabase/server'

export type NavLink = { href: string; label: string }

const FIXED_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
]

const ALWAYS_SHOW = ['insights']

export async function getNavLinks(): Promise<NavLink[]> {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, title')
    .eq('published', true)
    .neq('slug', 'home')
    .order('created_at', { ascending: true })

  const pageLinks: NavLink[] = (pages ?? []).map((p) => ({
    href: `/${p.slug}`,
    label: p.title as string,
  }))

  const staticLinks: NavLink[] = ALWAYS_SHOW
    .filter((slug) => !pageLinks.some((l) => l.href === `/${slug}`))
    .map((slug) => ({ href: `/${slug}`, label: slug.charAt(0).toUpperCase() + slug.slice(1) }))

  return [...FIXED_LINKS, ...pageLinks, ...staticLinks]
}
