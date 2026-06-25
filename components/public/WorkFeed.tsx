'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type WorkFeedItem = {
  id: string
  slug: string
  title: string
  updated_at: string
  content_type: 'project' | 'insight'
  project_status: 'complete' | 'on_site' | 'starting_soon' | null
}

type Filter = 'all' | 'project' | 'insight'

const STATUS_LABELS: Record<string, string> = {
  complete: 'Complete',
  on_site: 'On site',
  starting_soon: 'Starting soon',
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-[var(--color-ink)] text-white'
                : 'bg-white border border-[var(--color-greige)] text-[var(--color-ink)] hover:border-[var(--color-terracotta)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className="space-y-8">
          {filtered.map((item) => (
            <li key={item.id} className="border-b border-[var(--color-greige)]/60 pb-8 last:border-0">
              <Link href={`/insights/${item.slug}`} className="block group">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[var(--color-sage)] bg-white/80 border border-[var(--color-greige)]/50 rounded-full px-2.5 py-0.5">
                    {item.content_type === 'project' ? 'Project' : 'Insight'}
                  </span>
                  {item.content_type === 'project' && item.project_status && (
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[var(--color-ink)] bg-[var(--color-terracotta)]/15 border border-[var(--color-terracotta)]/30 rounded-full px-2.5 py-0.5">
                      {STATUS_LABELS[item.project_status] ?? item.project_status}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-terracotta)] transition-colors">
                  {item.title}
                </h2>
                <time className="text-sm text-[var(--color-muted)]" dateTime={item.updated_at}>
                  {new Date(item.updated_at).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[var(--color-muted)]">Nothing in this category yet.</p>
      )}
    </>
  )
}
