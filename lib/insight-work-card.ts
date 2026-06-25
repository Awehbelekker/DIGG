import type { Insight } from '@/lib/types/database'

const STATUS_LABELS: Record<string, string> = {
  complete: 'Complete',
  on_site: 'On site',
  starting_soon: 'Starting soon',
}

const GRADIENT_KEYS = ['terra', 'navy', 'sage', 'coral'] as const

export type WorkCardEditorItem = {
  title: string
  description: string
  link?: string
  status?: string
  comingSoon?: boolean
  imageUrl?: string
  gradientKey?: string
}

export function insightToWorkCardItem(
  insight: Pick<
    Insight,
    'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'content_type' | 'project_status'
  >,
  index = 0
): WorkCardEditorItem {
  return {
    title: insight.title,
    description: insight.excerpt?.trim() || '',
    link: `/insights/${insight.slug}`,
    status: insight.project_status ? STATUS_LABELS[insight.project_status] ?? undefined : undefined,
    imageUrl: insight.cover_image_url?.trim() || undefined,
    gradientKey: GRADIENT_KEYS[index % GRADIENT_KEYS.length],
  }
}

export function insightsToWorkCardItems(
  insights: Pick<
    Insight,
    'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'content_type' | 'project_status'
  >[]
): WorkCardEditorItem[] {
  return insights.map((insight, i) => insightToWorkCardItem(insight, i))
}
