import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SectionRenderer from '@/components/public/SectionRenderer'
import { getSiteSettings } from '@/lib/site-settings'
import { resolvePageSections } from '@/lib/builtin-pages'
import type { PageSection } from '@/lib/types/database'
import { enrichHomeWorkCardsFromInsights } from '@/lib/enrich-work-cards'

export default async function HomePage() {
  const supabase = await createClient()
  const [settings, { data: page }] = await Promise.all([
    getSiteSettings(),
    supabase.from('pages').select('*').eq('slug', 'home').eq('published', true).single(),
  ])

  if (!page) notFound()

  // Home is always section-based (mockup layout); ignore legacy GrapesJS rows in DB.
  const content = page.content as { sections?: PageSection[] } | null
  let sections = resolvePageSections('home', content?.sections, settings)
  sections = await enrichHomeWorkCardsFromInsights(supabase, sections, settings)

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section} siteSettings={settings} />
      ))}
    </div>
  )
}
