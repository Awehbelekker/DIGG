import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import InsightArticle from '@/components/public/InsightArticle'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('insights')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (!data) return { title: 'Not found' }
  return {
    title: `${data.title as string} | DIGG Work`,
    description: (data.excerpt as string) || undefined,
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: insight, error } = await supabase
    .from('insights')
    .select('title, body, excerpt, cover_image_url, updated_at, content_type, project_status')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !insight) notFound()

  return (
    <InsightArticle
      insight={{
        title: insight.title as string,
        body: insight.body as string,
        excerpt: insight.excerpt as string | null,
        cover_image_url: insight.cover_image_url as string | null,
        updated_at: insight.updated_at as string,
        content_type: insight.content_type as string | null,
        project_status: insight.project_status as string | null,
      }}
    />
  )
}
