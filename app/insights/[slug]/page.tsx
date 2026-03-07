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
  return { title: `${data.title as string} | DIGG Insights` }
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
    <div className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/insights" className="text-sm text-[#F7941D] hover:underline mb-6 inline-block">
          ← Insights
        </Link>
        <h1 className="text-3xl font-bold text-[#1B2A6B] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {insight.title as string}
        </h1>
        <time className="text-gray-500 text-sm block mb-8" dateTime={insight.updated_at as string}>
          {new Date(insight.updated_at as string).toLocaleDateString()}
        </time>
        <div className="text-gray-700 whitespace-pre-wrap font-[var(--font-body)] leading-relaxed">
          {(insight.body as string) || ''}
        </div>
      </article>
    </div>
  )
}
