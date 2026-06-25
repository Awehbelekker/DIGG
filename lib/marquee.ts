export type MarqueeItemKind = 'word' | 'phrase'
export type MarqueeSpeed = 'slow' | 'normal' | 'fast'
export type MarqueeDirection = 'left' | 'right'
export type MarqueeFeedMode = 'off' | 'titles' | 'excerpts'

export type MarqueeItem = {
  kind: MarqueeItemKind
  text: string
}

export type MarqueeSectionData = {
  items?: Array<{ kind?: MarqueeItemKind; text?: string; word?: string }>
  speed?: MarqueeSpeed
  direction?: MarqueeDirection
  pauseOnHover?: boolean
  feedMode?: MarqueeFeedMode
  feedLimit?: number
}

export const DEFAULT_MARQUEE_ITEMS: MarqueeItem[] = [
  { kind: 'word', text: 'Develop' },
  { kind: 'word', text: 'Invest' },
  { kind: 'word', text: 'Grow' },
  { kind: 'word', text: 'Give' },
]

export const MARQUEE_SPEED_SECONDS: Record<MarqueeSpeed, number> = {
  slow: 36,
  normal: 24,
  fast: 14,
}

const MAX_FEED_EXCERPT = 56

export function normalizeMarqueeItems(
  raw: MarqueeSectionData['items'] | undefined
): MarqueeItem[] {
  if (!raw?.length) return DEFAULT_MARQUEE_ITEMS
  const normalized = raw
    .map((item) => {
      const text = (item.text ?? item.word ?? '').trim()
      if (!text) return null
      const kind: MarqueeItemKind = item.kind === 'phrase' ? 'phrase' : 'word'
      return { kind, text }
    })
    .filter((item): item is MarqueeItem => item !== null)
  return normalized.length > 0 ? normalized : DEFAULT_MARQUEE_ITEMS
}

export function truncateMarqueePhrase(text: string, max = MAX_FEED_EXCERPT): string {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

/** After each pillar word, inject the next Work feed line when feed mode is on. */
export function buildMarqueeSequence(
  manualItems: MarqueeItem[],
  feedPhrases: string[],
  feedMode: MarqueeFeedMode
): MarqueeItem[] {
  const manual = manualItems.filter((i) => i.text.trim())
  if (feedMode === 'off' || feedPhrases.length === 0) {
    return manual.length > 0 ? manual : DEFAULT_MARQUEE_ITEMS
  }

  const feed = feedPhrases.map((p) => p.trim()).filter(Boolean)
  if (feed.length === 0) {
    return manual.length > 0 ? manual : DEFAULT_MARQUEE_ITEMS
  }

  let feedIdx = 0
  const result: MarqueeItem[] = []

  for (const item of manual) {
    result.push(item)
    if (item.kind === 'word') {
      result.push({
        kind: 'phrase',
        text: feed[feedIdx % feed.length],
      })
      feedIdx += 1
    }
  }

  return result.length > 0 ? result : DEFAULT_MARQUEE_ITEMS
}

/** Repeat sequence so the track always spans beyond the viewport, then duplicate for seamless loop. */
export function buildMarqueeTrack(sequence: MarqueeItem[]): MarqueeItem[] {
  const base = sequence.filter((i) => i.text.trim())
  if (base.length === 0) return [...DEFAULT_MARQUEE_ITEMS, ...DEFAULT_MARQUEE_ITEMS]

  const minCopies = Math.max(4, Math.ceil(20 / base.length))
  const half = Array.from({ length: minCopies }, () => base).flat()
  return [...half, ...half]
}
