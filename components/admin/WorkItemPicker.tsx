'use client'

import type { Insight } from '@/lib/types/database'
import { insightToWorkCardItem, type WorkCardEditorItem } from '@/lib/insight-work-card'

type WorkInsight = Pick<
  Insight,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'content_type' | 'project_status'
>

export default function WorkItemPicker({
  insights,
  cardIndex,
  onSelect,
  label = 'Fill from Work item',
}: {
  insights: WorkInsight[]
  cardIndex: number
  onSelect: (item: WorkCardEditorItem) => void
  label?: string
}) {
  if (insights.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        No published Work items yet.{' '}
        <a href="/admin/insights/new" className="text-[#B56244] font-semibold hover:underline">
          Create one →
        </a>
      </p>
    )
  }

  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <select
        defaultValue=""
        onChange={(e) => {
          const id = e.target.value
          if (!id) return
          const insight = insights.find((i) => i.id === id)
          if (insight) onSelect(insightToWorkCardItem(insight, cardIndex))
          e.target.value = ''
        }}
        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
      >
        <option value="">Choose a published project or insight…</option>
        {insights.map((insight) => (
          <option key={insight.id} value={insight.id}>
            {insight.content_type === 'project' ? '🏗 ' : '📝 '}
            {insight.title}
          </option>
        ))}
      </select>
    </label>
  )
}

export function WorkItemBulkFill({
  insights,
  onFill,
  max = 4,
}: {
  insights: WorkInsight[]
  onFill: (items: WorkCardEditorItem[]) => void
  max?: number
}) {
  if (insights.length === 0) return null

  return (
    <button
      type="button"
      onClick={() => {
        const picked = insights.slice(0, max).map((insight, i) => insightToWorkCardItem(insight, i))
        onFill(picked)
      }}
      className="text-sm px-4 py-2 rounded-lg border border-[#B56244] text-[#B56244] font-semibold hover:bg-orange-50"
    >
      Fill {Math.min(max, insights.length)} cards from latest Work →
    </button>
  )
}
