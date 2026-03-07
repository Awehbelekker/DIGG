import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SectionRenderer from '@/components/public/SectionRenderer'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('title, meta_title, meta_description, meta_og_image')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!page) return { title: 'Not found' }
  const ogImage = (page.meta_og_image as string)?.trim()
  return {
    title: (page.meta_title as string) || (page.title as string) || 'Page',
    description: (page.meta_description as string) || undefined,
    ...(ogImage && {
      openGraph: { images: [ogImage] },
      twitter: { card: 'summary_large_image' as const, images: [ogImage] },
    }),
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !page) notFound()

  const content = page.content as { sections?: Array<{ type: string; data: Record<string, unknown> }> } | null
  const sections = content?.sections ?? []

  return (
    <div className="min-h-screen">
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section as import('@/lib/types/database').PageSection} />
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
