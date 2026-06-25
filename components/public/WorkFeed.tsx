'use client'

import { useMemo, useState } from 'react'
import WorkCard, { type WorkCardItem } from '@/components/public/WorkCard'

export type WorkFeedItem = {
  id: string
  slug: string
  title: string
  updated_at: string
  excerpt?: string | null
  cover_image_url?: string | null
  content_type: 'project' | 'insight'
  project_status: 'complete' | 'on_site' | 'starting_soon' | null
}

type Filter = 'all' | 'project' | 'insight'

const STATUS_LABELS: Record<string, string> = {
  complete: 'Complete',
  on_site: 'On site',
  starting_soon: 'Starting soon',
}

const GRADIENTS = ['terra', 'navy', 'sage', 'coral'] as const

function toCard(item: WorkFeedItem, index: number): WorkCardItem {
  const badge =
    item.content_type === 'project' && item.project_status
      ? STATUS_LABELS[item.project_status] ?? item.project_status
      : undefined
  return {
    title: item.title,
    description: item.excerpt?.trim() || 'Read the full story on our work feed.',
    link: `/insights/${item.slug}`,
    status: badge,
    contentType: item.content_type,
    imageUrl: item.cover_image_url?.trim() || undefined,
    gradientKey: GRADIENTS[index % GRADIENTS.length],
    readLabel: 'Read the story →',
  }
}

export default function WorkFeed({ items }: { items: WorkFeedItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((i) => i.content_type === filter)
  }, [items, filter])

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'project', label: 'Projects' },
    { id: 'insight', label: 'Insights' },
  ]

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter work">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold transition-colors ${
              filter === tab.id
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-white border border-[var(--color-greige)] text-[var(--color-ink)] active:bg-[var(--color-bone)] md:hover:border-[var(--color-lead)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filtered.map((item, i) => (
            <WorkCard key={item.id} item={toCard(item, i)} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--color-muted)]">Nothing in this category yet.</p>
      )}
    </>
  )
}
