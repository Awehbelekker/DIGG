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

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <Link href="/insights" className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)] font-medium mb-6 inline-block">
          ← Work
        </Link>
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
