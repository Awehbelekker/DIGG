import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminPageHeading from '@/components/admin/AdminPageHeading'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const [pagesResult, imagesResult, formsResult] = await Promise.all([
    supabase.from('pages').select('id', { count: 'exact', head: true }),
    supabase.from('images').select('id', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('id', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Pages', count: pagesResult.count || 0, href: '/admin/pages' },
    { label: 'Images', count: imagesResult.count || 0, href: '/admin/images' },
    { label: 'Form Submissions', count: formsResult.count || 0, href: '/admin/forms' },
  ]

  // Get recent form submissions
  const { data: recentSubmissions } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8">Dashboard</AdminPageHeading>

      {/* Quick links */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/admin/settings"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1B2A6B] text-white text-sm font-medium hover:bg-[#2a3d8a] transition-colors"
        >
          Hero & Selected Work
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          View site →
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-600 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{stat.label}</h3>
            <p className="text-4xl font-bold text-[#F7941D]">{stat.count}</p>
          </Link>
        ))}
      </div>

      {/* Recent Form Submissions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <AdminPageHeading as="h2" className="mb-4">Recent Form Submissions</AdminPageHeading>
        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="space-y-4">
            {recentSubmissions.map((submission: import('@/lib/types/database').FormSubmission) => (
              <div key={submission.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#1B2A6B]">
                      {submission.data.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {submission.form_type === 'contact' ? 'Contact Form' : 'Agent Registration'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#5BC8E8] text-[#1B2A6B] rounded-full text-xs font-semibold">
                    {submission.form_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No submissions yet</p>
        )}
        <Link
          href="/admin/forms"
          className="mt-4 inline-block text-[#F7941D] hover:text-[#e6850a] font-semibold"
        >
          View all submissions →
        </Link>
      </div>
    </div>
  )
}
