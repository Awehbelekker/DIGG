import Link from 'next/link'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'
import PageWrap from '@/components/public/ui/PageWrap'
import { BtnLead, BtnGhost } from '@/components/public/ui/Buttons'

export type InsightArticleData = {
  title: string
  body: string
  excerpt?: string | null
  cover_image_url?: string | null
  updated_at: string
  content_type?: string | null
  project_status?: string | null
}

const STATUS_LABELS: Record<string, string> = {
  complete: 'Complete',
  on_site: 'On site',
  starting_soon: 'Starting soon',
}

type InsightArticleProps = {
  insight: InsightArticleData
  showBackLink?: boolean
  previewBanner?: React.ReactNode
}

export default function InsightArticle({
  insight,
  showBackLink = true,
  previewBanner,
}: InsightArticleProps) {
  const contentType = insight.content_type || 'insight'
  const statusLabel = insight.project_status ? STATUS_LABELS[insight.project_status] ?? null : null
  const cover = insight.cover_image_url?.trim()
  const excerpt = insight.excerpt?.trim()

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      {previewBanner}
      <article>
        {cover && (
          <div className="w-full h-[200px] sm:h-[280px] md:h-[360px] relative bg-[var(--color-ink)]">
            <ImageWithPlaceholder
              src={cover}
              alt={insight.title}
              aspectRatio="auto"
              className="absolute inset-0 w-full h-full object-cover"
              placeholderLabel={insight.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 to-transparent pointer-events-none" aria-hidden />
          </div>
        )}

        <PageWrap className={`max-w-3xl ${cover ? 'pt-8 sm:pt-10' : 'pt-10 sm:pt-14'} pb-12 sm:pb-16`}>
          {showBackLink && (
            <Link
              href="/insights"
              className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[var(--color-lead-deep)] mb-4 sm:mb-6 active:opacity-80 md:hover:underline"
            >
              ← Back to work
            </Link>
          )}

          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-sage)] bg-white border border-[var(--color-greige)]/50 rounded-full px-2.5 py-1">
              {contentType === 'project' ? 'Project' : 'Insight'}
            </span>
            {statusLabel && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-ink)] bg-[var(--color-lead)]/15 border border-[var(--color-lead)]/30 rounded-full px-2.5 py-1">
                {statusLabel}
              </span>
            )}
          </div>

          <h1
            className="text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold tracking-tight text-[var(--color-ink)] mb-3 sm:mb-4 leading-[1.08]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {insight.title}
          </h1>

          <time className="text-[var(--color-muted)] text-sm block mb-6 sm:mb-8" dateTime={insight.updated_at}>
            {new Date(insight.updated_at).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          {excerpt && (
            <p className="text-base sm:text-lg text-[#3a4654] leading-relaxed mb-6 sm:mb-8 font-medium border-l-[3px] border-[var(--color-lead)] pl-4">
              {excerpt}
            </p>
          )}

          <div className="prose-digg text-[var(--color-ink)]/90">
            {insight.body || ''}
          </div>

          <div className="mt-10 sm:mt-12 pt-8 border-t border-[var(--color-greige)]/60 flex flex-col sm:flex-row flex-wrap gap-3">
            <BtnLead href="/contact">Discuss a project</BtnLead>
            <BtnGhost href="/insights">More work</BtnGhost>
          </div>
        </PageWrap>
      </article>
    </div>
  )
}
