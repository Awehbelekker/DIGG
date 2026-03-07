import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SectionRenderer from '@/components/public/SectionRenderer'
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

  const content = page.content as { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
  const sections = content?.sections ?? []

  return (
    <div className="min-h-screen">
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section as PageSection} />
      ))}
      {sections.length === 0 && (
        <section className="py-20 text-center text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-[#1B2A6B] mb-4">
              Welcome
            </h1>
            <p>This page has no content yet. Go to Admin &rarr; Pages &rarr; home to build it.</p>
          </div>
        </section>
      )}
    </div>
  )
}
