import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SectionRenderer from '@/components/public/SectionRenderer'
import GjsPageRenderer from '@/components/public/GjsPageRenderer'
import { HOME_PAGE_SECTIONS } from '@/lib/home-content'
import type { PageSection } from '@/lib/types/database'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .eq('published', true)
    .single()

  if (!page) notFound()

  if ((page.editor_type as string) === 'grapesjs') {
    return (
      <GjsPageRenderer
        html={(page.content_html as string) || ''}
        css={(page.content_css as string) || ''}
      />
    )
  }

  const content = page.content as { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
  const dbSections = content?.sections ?? []
  const sections = dbSections.length > 0 ? dbSections : HOME_PAGE_SECTIONS

  return (
    <div className="min-h-screen bg-[#F4F0E8]">
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section as PageSection} />
      ))}
    </div>
  )
}
