import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import InsightArticle from '@/components/public/InsightArticle'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function PreviewInsightPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: insight, error } = await supabase
    .from('insights')
    .select('title, body, excerpt, cover_image_url, updated_at, content_type, project_status, published')
    .eq('id', id)
    .single()

  if (error || !insight) notFound()

  return (
    <InsightArticle
      showBackLink={false}
      previewBanner={
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2.5 text-center text-sm text-amber-900 [padding-top:max(0.625rem,env(safe-area-inset-top))]">
          Preview — only you see this. This item is {insight.published ? 'published' : 'unpublished'}.
        </div>
      }
      insight={{
        title: insight.title as string,
        body: (insight.body as string) || 'No content yet.',
        excerpt: insight.excerpt as string | null,
        cover_image_url: insight.cover_image_url as string | null,
        updated_at: insight.updated_at as string,
        content_type: insight.content_type as string | null,
        project_status: insight.project_status as string | null,
      }}
    />
  )
}
