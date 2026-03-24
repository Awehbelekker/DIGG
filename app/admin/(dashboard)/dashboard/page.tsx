import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import AdminSafeLink from '@/components/admin/AdminSafeLink'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all dashboard data in parallel
  const [
    pagesResult,
    imagesResult,
    formsResult,
    insightsResult,
    newsletterResult,
    recentSubmissionsData,
    recentPagesData,
    homePageData,
    aboutPageData,
  ] = await Promise.all([
    supabase.from('pages').select('id', { count: 'exact', head: true }),
    supabase.from('images').select('id', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('id', { count: 'exact', head: true }),
    supabase.from('insights').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_signups').select('id', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('pages').select('id, title, slug, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('pages').select('id, title, slug').eq('slug', 'home').maybeSingle(),
    supabase.from('pages').select('id, title, slug').eq('slug', 'about').maybeSingle(),
  ])

  const recentSubmissions = recentSubmissionsData.data ?? []
  const recentPages = recentPagesData.data ?? []
  const homePage = homePageData.data
  const aboutPage = aboutPageData.data

  const stats = [
    { label: 'Pages', count: pagesResult.count ?? 0, href: '/admin/pages' },
    { label: 'Images', count: imagesResult.count ?? 0, href: '/admin/images' },
    { label: 'Form Submissions', count: formsResult.count ?? 0, href: '/admin/forms' },
    { label: 'Insights', count: insightsResult.count ?? 0, href: '/admin/insights' },
    { label: 'Newsletter signups', count: newsletterResult.count ?? 0, href: '/admin/newsletter' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-2">Dashboard</AdminPageHeading>
      <p className="text-gray-500 text-sm mb-8">Overview of your site content and activity.</p>

      {/* Quick links */}
      <div className="mb-8 flex flex-wrap gap-3">
        <AdminSafeLink
          href="/admin/settings"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1B2A6B] text-white text-sm font-medium hover:bg-[#2a3d8a] transition-colors"
        >
          Hero & Selected Work
        </AdminSafeLink>
        {homePage && (
          <AdminSafeLink
            href={`/admin/pages/${homePage.id}`}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-[#1B2A6B] bg-white text-[#1B2A6B] text-sm font-medium hover:bg-[#1B2A6B] hover:text-white transition-colors"
          >
            Edit Home
          </AdminSafeLink>
        )}
        {aboutPage && (
          <AdminSafeLink
            href={`/admin/pages/${aboutPage.id}`}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-[#1B2A6B] bg-white text-[#1B2A6B] text-sm font-medium hover:bg-[#1B2A6B] hover:text-white transition-colors"
          >
            Edit About
          </AdminSafeLink>
        )}
        <AdminSafeLink
          href="/"
          openInNewTab
          className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          View site →
        </AdminSafeLink>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <AdminSafeLink
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-600 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{stat.label}</h3>
            <p className="text-4xl font-bold text-[#F7941D]">{stat.count}</p>
          </AdminSafeLink>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent pages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AdminPageHeading as="h2" className="mb-4">Recent pages</AdminPageHeading>
          {recentPages.length > 0 ? (
            <div className="space-y-4">
              {recentPages.map((p: { id: string; title: string | null; slug: string | null; updated_at: string }) => (
                <div key={p.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1B2A6B] truncate">{p.title || 'Untitled'}</p>
                      <p className="text-sm text-gray-500">/{p.slug === 'home' ? '' : p.slug || '—'}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(p.updated_at).toLocaleString()}</p>
                    </div>
                    <AdminSafeLink
                      href={`/admin/pages/${p.id}`}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F7941D] text-white text-sm font-medium hover:bg-[#e6850a] transition-colors"
                    >
                      Edit
                    </AdminSafeLink>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pages yet</p>
          )}
          <AdminSafeLink
            href="/admin/pages"
            className="mt-4 inline-block text-[#F7941D] hover:text-[#e6850a] font-semibold"
          >
            View all pages →
          </AdminSafeLink>
        </div>

        {/* Recent Form Submissions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AdminPageHeading as="h2" className="mb-4">Recent Form Submissions</AdminPageHeading>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map((submission: import('@/lib/types/database').FormSubmission) => (
                <div key={submission.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-[#1B2A6B]">
                        {typeof (submission.data as Record<string, unknown>)?.name === 'string'
                          ? (submission.data as Record<string, unknown>).name as string
                          : 'Unknown'}
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
          <AdminSafeLink
            href="/admin/forms"
            className="mt-4 inline-block text-[#F7941D] hover:text-[#e6850a] font-semibold"
          >
            View all submissions →
          </AdminSafeLink>
        </div>
      </div>
    </div>
  )
}
