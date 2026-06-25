import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Insight } from '@/lib/types/database'

export const metadata = {
  title: 'Work | DIGG — Cape Town',
  description: 'Projects and insights from DIGG — property development and architecture in Cape Town.',
}

export default async function WorkListPage() {
  const supabase = await createClient()
  const { data: insights } = await supabase
    .from('insights')
    .select('id, slug, title, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

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

          {insights && insights.length > 0 ? (
            <ul className="space-y-8">
              {(insights as Pick<Insight, 'id' | 'slug' | 'title' | 'updated_at'>[]).map((insight) => (
                <li key={insight.id} className="border-b border-[var(--color-greige)]/60 pb-8 last:border-0">
                  <Link href={`/insights/${insight.slug}`} className="block group">
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[var(--color-sage)] bg-white/80 border border-[var(--color-greige)]/50 rounded-full px-2.5 py-0.5 mb-2">
                      Insight
                    </span>
                    <h2 className="text-xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-terracotta)] transition-colors">
                      {insight.title}
                    </h2>
                    <time className="text-sm text-[var(--color-muted)]" dateTime={insight.updated_at}>
                      {new Date(insight.updated_at).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-muted)]">Nothing published yet. Check back soon.</p>
          )}
        </div>
      </section>
    </div>
  )
}
