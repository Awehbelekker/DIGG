import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

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
    .select('*')
    .eq('id', id)
    .single()

  if (error || !insight) notFound()

  return (
    <div className="min-h-screen">
      <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
        Preview — only you see this. This insight is {insight.published ? 'published' : 'unpublished'}.
      </div>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#1B2A6B] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {insight.title as string}
        </h1>
        <div className="text-gray-700 whitespace-pre-wrap font-[var(--font-body)]">
          {(insight.body as string) || 'No content yet.'}
        </div>
      </article>
    </div>
  )
}
