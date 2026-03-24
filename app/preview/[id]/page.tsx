import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import SectionRenderer from '@/components/public/SectionRenderer'
import GjsPageRenderer from '@/components/public/GjsPageRenderer'
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

  const published = Boolean(page.published)
  const editorType = page.editor_type as string | undefined

  if (editorType === 'grapesjs') {
    const html = ((page.content_html as string) || '').trim()
    const css = (page.content_css as string) || ''
    return (
      <div className="min-h-screen">
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
          Preview — last saved version. This page is {published ? 'published' : 'unpublished'} on the live site.
        </div>
        {html ? (
          <GjsPageRenderer html={html} css={css} />
        ) : (
          <section className="py-12 text-center text-gray-500 text-sm px-4">
            No HTML saved yet. Add blocks in the visual builder and click Save.
          </section>
        )}
      </div>
    )
  }

  const content = page.content as { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
  const sections = content?.sections ?? []

  return (
    <div className="min-h-screen">
      <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
        Preview — section-based page. This page is {published ? 'published' : 'unpublished'}.
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
