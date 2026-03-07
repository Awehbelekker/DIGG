import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const STATIC_ROUTES = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/for-agents', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/give', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/insights', changeFrequency: 'weekly' as const, priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://digg-ct.co.za'

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  let cmsEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('published', true)
    if (pages?.length) {
      cmsEntries = pages.map((p) => ({
        url: `${base}/${(p.slug as string).replace(/^\/+/, '')}`,
        lastModified: p.updated_at ? new Date(p.updated_at as string) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // omit CMS URLs if DB unavailable (e.g. build without Supabase)
  }

  let insightEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: insights } = await supabase
      .from('insights')
      .select('slug, updated_at')
      .eq('published', true)
    if (insights?.length) {
      insightEntries = insights.map((i) => ({
        url: `${base}/insights/${(i.slug as string).replace(/^\/+/, '')}`,
        lastModified: i.updated_at ? new Date(i.updated_at as string) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // omit if table missing or unavailable
  }

  return [...staticEntries, ...cmsEntries, ...insightEntries]
}
