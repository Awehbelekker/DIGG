import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('insights')
    .select('title')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (!data) return { title: 'Not found' }
  return { title: `${data.title as string} | DIGG Work` }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: insight, error } = await supabase
    .from('insights')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !insight) notFound()

  const contentType = (insight.content_type as string) || 'insight'
  const projectStatus = insight.project_status as string | null
  const statusLabel =
    projectStatus === 'complete'
      ? 'Complete'
      : projectStatus === 'on_site'
        ? 'On site'
        : projectStatus === 'starting_soon'
          ? 'Starting soon'
          : null

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <Link href="/insights" className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)] font-medium mb-6 inline-block">
          ← Work
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-sage)] bg-white border border-[var(--color-greige)]/50 rounded-full px-2.5 py-0.5">
            {contentType === 'project' ? 'Project' : 'Insight'}
          </span>
          {statusLabel && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-ink)] bg-[var(--color-terracotta)]/15 border border-[var(--color-terracotta)]/30 rounded-full px-2.5 py-0.5">
              {statusLabel}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {insight.title as string}
        </h1>
        <time className="text-[var(--color-muted)] text-sm block mb-8" dateTime={insight.updated_at as string}>
          {new Date(insight.updated_at as string).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <div className="text-[var(--color-ink)]/90 whitespace-pre-wrap leading-relaxed prose-digg">
          {(insight.body as string) || ''}
        </div>
      </article>
    </div>
  )
}
