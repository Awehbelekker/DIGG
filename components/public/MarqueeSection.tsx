import { createClient } from '@/lib/supabase/server'
import PillarsMarquee from '@/components/public/PillarsMarquee'
import {
  type MarqueeDirection,
  type MarqueeFeedMode,
  type MarqueeSectionData,
  type MarqueeSpeed,
  buildMarqueeSequence,
  normalizeMarqueeItems,
  truncateMarqueePhrase,
} from '@/lib/marquee'

export default async function MarqueeSection({ data }: { data: Record<string, unknown> }) {
  const section = data as MarqueeSectionData
  const speed = (section.speed as MarqueeSpeed) || 'normal'
  const direction = (section.direction as MarqueeDirection) || 'left'
  const pauseOnHover = Boolean(section.pauseOnHover)
  const feedMode = (section.feedMode as MarqueeFeedMode) || 'off'
  const feedLimit = Math.min(Math.max(section.feedLimit ?? 8, 1), 20)

  let feedPhrases: string[] = []
  if (feedMode !== 'off') {
    const supabase = await createClient()
    const { data: insights } = await supabase
      .from('insights')
      .select('title, excerpt')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(feedLimit)

    feedPhrases =
      insights?.map((row) => {
        if (feedMode === 'excerpts') {
          const excerpt = (row.excerpt as string | null)?.trim()
          if (excerpt) return truncateMarqueePhrase(excerpt)
        }
        return ((row.title as string) || '').trim()
      }).filter(Boolean) ?? []
  }

  const manualItems = normalizeMarqueeItems(section.items)
  const sequence = buildMarqueeSequence(manualItems, feedPhrases, feedMode)

  return (
    <PillarsMarquee
      sequence={sequence}
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
    />
  )
}
