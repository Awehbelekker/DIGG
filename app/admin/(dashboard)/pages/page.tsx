import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import PageRowActions from '@/components/admin/PageRowActions'
import { isBuiltinPageSlug } from '@/lib/builtin-pages'

export const dynamic = 'force-dynamic'

export default async function PagesListPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, published, editor_type, updated_at')
    .order('slug', { ascending: true })

  const rows = pages ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <AdminPageHeading subtitle="Edit Home, About, and Contact content, links, and images. Use Settings for brand colours and contact details.">
          Pages
        </AdminPageHeading>
        <AdminSafeLink
          href="/admin/pages/new"
          className="inline-flex px-5 py-2.5 rounded-xl bg-[#B56244] text-white text-sm font-semibold hover:bg-[#9A4F35]"
        >
          + Custom page (visual builder)
        </AdminSafeLink>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-[#152232]">{page.title as string}</div>
                  {isBuiltinPageSlug(page.slug as string) && (
                    <span className="text-xs text-[#B56244] font-medium">Main site page</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">/{page.slug as string}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {page.published ? 'Live' : 'Draft'}
                  </span>
                  {(page.editor_type as string) === 'grapesjs' && (
                    <span className="ml-2 text-xs text-gray-500">Visual builder</span>
                  )}
                </td>
                <PageRowActions page={{ id: page.id as string, title: page.title as string, slug: page.slug as string }} />
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-gray-500">No pages yet.</p>
        )}
      </div>
    </div>
  )
}
