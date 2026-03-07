import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Insight } from '@/lib/types/database'

export const metadata = {
  title: 'Insights | DIGG Architecture Cape Town',
  description: 'Articles and updates from DIGG Architecture — property that pays.',
}

export default async function InsightsListPage() {
  const supabase = await createClient()
  const { data: insights } = await supabase
    .from('insights')
    .select('id, slug, title, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1B2A6B] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Insights
          </h1>
          <p className="text-gray-600 mb-10">Articles and updates from the DIGG team.</p>

          {insights && insights.length > 0 ? (
            <ul className="space-y-6">
              {(insights as Pick<Insight, 'id' | 'slug' | 'title' | 'updated_at'>[]).map((insight) => (
                <li key={insight.id}>
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="block group"
                  >
                    <h2 className="text-xl font-semibold text-[#1B2A6B] group-hover:text-[#F7941D] transition-colors">
                      {insight.title}
                    </h2>
                    <time className="text-sm text-gray-500" dateTime={insight.updated_at}>
                      {new Date(insight.updated_at).toLocaleDateString()}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No insights published yet. Check back soon.</p>
          )}
        </div>
      </section>
    </div>
  )
}
