import type { SupabaseClient } from '@supabase/supabase-js'
import type { PageSection } from '@/lib/types/database'
import type { SiteSettings } from '@/lib/site-settings'
import { insightsToWorkCardItems } from '@/lib/insight-work-card'

/** When homepage work cards are empty, fill from latest published Work items. */
export async function enrichHomeWorkCardsFromInsights(
  supabase: SupabaseClient,
  sections: PageSection[],
  settings: SiteSettings
): Promise<PageSection[]> {
  if (settings.homepage_products?.length) return sections

  const workSection = sections.find((s) => s.type === 'work_cards')
  if (!workSection) return sections

  const items = (workSection.data.items as { title?: string }[]) ?? []
  const hasContent = items.some((item) => item.title?.trim())
  if (hasContent) return sections

  const { data: rows } = await supabase
    .from('insights')
    .select('slug, title, excerpt, cover_image_url, content_type, project_status')
    .eq('published', true)
    .order('updated_at', { ascending: false })
    .limit(4)

  if (!rows?.length) return sections

  const cardItems = insightsToWorkCardItems(rows)

  return sections.map((section) =>
    section.type === 'work_cards'
      ? { ...section, data: { ...section.data, items: cardItems } }
      : section
  )
}
