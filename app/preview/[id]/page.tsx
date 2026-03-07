import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import SectionRenderer from '@/components/public/SectionRenderer'
import type { PageSection } from '@/lib/types/database'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function PreviewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) notFound()

  const content = page.content as { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
  const sections = content?.sections ?? []

  return (
    <div className="min-h-screen">
      <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
        Preview mode — only you see this. This page is {page.published ? 'published' : 'unpublished'}.
      </div>
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section as PageSection} />
      ))}
      {sections.length === 0 && (
        <section className="py-20 text-center text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-[#1B2A6B] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {page.title as string}
            </h1>
            <p>This page has no content yet. Add sections in the admin page editor.</p>
          </div>
        </section>
      )}
    </div>
  )
}
