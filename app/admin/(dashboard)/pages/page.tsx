import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import PageRowActions from '@/components/admin/PageRowActions'

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <AdminPageHeading>Pages</AdminPageHeading>
        <Link
          href="/admin/pages/new"
          className="bg-[#F7941D] text-white px-6 py-2 rounded font-semibold hover:bg-[#e6850a] transition-colors"
        >
          Create New Page
        </Link>
      </div>

      {pages && pages.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page: any) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">/{page.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      page.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <PageRowActions page={{ id: page.id, title: page.title, slug: page.slug }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">No pages yet</p>
          <Link
            href="/admin/pages/new"
            className="inline-block bg-[#F7941D] text-white px-6 py-2 rounded font-semibold hover:bg-[#e6850a] transition-colors"
          >
            Create Your First Page
          </Link>
        </div>
      )}
    </div>
  )
}
