import { createClient } from '@/lib/supabase/server'
import WorkFeed, { type WorkFeedItem } from '@/components/public/WorkFeed'
import PageWrap from '@/components/public/ui/PageWrap'
import Eyebrow from '@/components/public/ui/Eyebrow'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata = {
  title: 'Work | DIGG — Cape Town',
  description: 'Projects and insights from DIGG — property development and architecture in Cape Town.',
}

export default async function WorkListPage() {
  const [supabase, settings] = await Promise.all([createClient(), getSiteSettings()])
  const { data: rows } = await supabase
    .from('insights')
    .select('id, slug, title, excerpt, cover_image_url, updated_at, content_type, project_status')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const items: WorkFeedItem[] = (rows ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string | null,
    cover_image_url: row.cover_image_url as string | null,
    updated_at: row.updated_at as string,
    content_type: (row.content_type as WorkFeedItem['content_type']) || 'insight',
    project_status: (row.project_status as WorkFeedItem['project_status']) ?? null,
  }))

  const kick = settings.work_page_kick?.trim() || 'Work'
  const title = settings.work_page_title?.trim() || 'Projects & insights'
  const intro =
    settings.work_page_intro?.trim() ||
    'A single feed of project writeups and short pieces on development and investment. Real projects, plain language.'

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      <section className="page-top pb-12 sm:pb-16">
        <PageWrap>
          <Eyebrow className="mb-4 sm:mb-6">{kick}</Eyebrow>
          <h1
            className="text-[clamp(2rem,6vw,3.25rem)] font-extrabold tracking-tight leading-[1.05] mb-4 sm:mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title.replace(/\.$/, '')}
            <span className="text-[var(--color-coral)]">.</span>
          </h1>
          <p className="text-base sm:text-[17px] text-[#3a4654] leading-relaxed mb-8 sm:mb-10 max-w-2xl">{intro}</p>
          <WorkFeed items={items} />
        </PageWrap>
      </section>
    </div>
  )
}
