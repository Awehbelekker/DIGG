import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import InsightRowActions from '@/components/admin/InsightRowActions'
import type { Insight } from '@/lib/types/database'

export default async function AdminInsightsPage() {
  const supabase = await createClient()
  const { data: insights } = await supabase
    .from('insights')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <AdminPageHeading subtitle="Articles and updates for your site.">Insights</AdminPageHeading>
        <AdminSafeLink
          href="/admin/insights/new"
          className="bg-[#F7941D] text-white px-6 py-2 rounded font-semibold hover:bg-[#e6850a] transition-colors"
        >
          New Insight
        </AdminSafeLink>
      </div>

      {insights && insights.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(insights as Insight[]).map((insight) => (
                <tr key={insight.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">/{insight.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      insight.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(insight.updated_at).toLocaleDateString()}
                  </td>
                  <InsightRowActions insight={insight} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">No insights yet</p>
          <AdminSafeLink
            href="/admin/insights/new"
            className="inline-block bg-[#F7941D] text-white px-6 py-2 rounded font-semibold hover:bg-[#e6850a] transition-colors"
          >
            Create your first insight
          </AdminSafeLink>
        </div>
      )}
    </div>
  )
}
