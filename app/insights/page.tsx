import { createClient } from '@/lib/supabase/server'
import WorkFeed, { type WorkFeedItem } from '@/components/public/WorkFeed'

export const metadata = {
  title: 'Work | DIGG — Cape Town',
  description: 'Projects and insights from DIGG — property development and architecture in Cape Town.',
}

export default async function WorkListPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('insights')
    .select('id, slug, title, updated_at, content_type, project_status')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const items: WorkFeedItem[] = (rows ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    updated_at: row.updated_at as string,
    content_type: (row.content_type as WorkFeedItem['content_type']) || 'insight',
    project_status: (row.project_status as WorkFeedItem['project_status']) ?? null,
  }))

  return (
    <div className="min-h-screen bg-[var(--color-bone)]">
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-terracotta)] mb-3">Work</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Projects &amp; insights
          </h1>
          <p className="text-[var(--color-muted)] mb-10 max-w-2xl leading-relaxed">
            A single feed of project writeups and short pieces on development and investment. Real projects, plain language.
          </p>

          <WorkFeed items={items} />
        </div>
      </section>
    </div>
  )
}
