import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SectionRenderer from '@/components/public/SectionRenderer'
import GjsPageRenderer from '@/components/public/GjsPageRenderer'
import { getSiteSettings } from '@/lib/site-settings'
import { isBuiltinPageSlug, resolvePageSections } from '@/lib/builtin-pages'
import type { PageSection } from '@/lib/types/database'

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
  const [settings, { data: page, error }] = await Promise.all([
    getSiteSettings(),
    supabase.from('pages').select('*').eq('slug', slug).eq('published', true).single(),
  ])

  if (error || !page) notFound()

  const builtin = isBuiltinPageSlug(slug)
  const useGrapesJs = (page.editor_type as string) === 'grapesjs' && !builtin

  if (useGrapesJs) {
    return (
      <GjsPageRenderer
        html={(page.content_html as string) || ''}
        css={(page.content_css as string) || ''}
      />
    )
  }

  const content = page.content as { sections?: PageSection[] } | null
  const sections = builtin
    ? resolvePageSections(slug, content?.sections, settings)
    : content?.sections ?? []

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section} siteSettings={settings} />
      ))}
      {sections.length === 0 && (
        <section className="py-20 text-center text-[var(--color-muted)]">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {page.title as string}
            </h1>
            <p>This page has no content yet.</p>
          </div>
        </section>
      )}
    </div>
  )
}
