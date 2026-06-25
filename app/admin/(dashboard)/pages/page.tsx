import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import PageRowActions from '@/components/admin/PageRowActions'
import { isBuiltinPageSlug } from '@/lib/builtin-pages'

export const dynamic = 'force-dynamic'

function editorModeLabel(slug: string, editorType: string | null | undefined): { label: string; hint: string } {
  const isGrapes = editorType === 'grapesjs'
  if (isBuiltinPageSlug(slug)) {
    return isGrapes
      ? {
          label: 'Visual builder',
          hint: 'This main page uses the advanced visual builder. Switch back in the editor to restore mockup sections.',
        }
      : {
          label: 'Section editor',
          hint: 'Structured mockup layout — edit headings, images, and cards section by section.',
        }
  }
  return isGrapes
    ? { label: 'Visual builder', hint: 'Freeform drag-and-drop page layout.' }
    : { label: 'Section editor', hint: 'Structured sections (unusual for custom pages).' }
}

export default async function PagesListPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, published, editor_type, updated_at')
    .order('slug', { ascending: true })

  const rows = pages ?? []
  const mainPages = rows.filter((p) => isBuiltinPageSlug(p.slug as string))
  const customPages = rows.filter((p) => !isBuiltinPageSlug(p.slug as string))

  const renderRow = (page: (typeof rows)[0]) => {
    const mode = editorModeLabel(page.slug as string, page.editor_type as string)
    return (
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
          <span
            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
              mode.label === 'Visual builder' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
            }`}
            title={mode.hint}
          >
            {mode.label}
          </span>
        </td>
        <PageRowActions page={{ id: page.id as string, title: page.title as string, slug: page.slug as string }} />
      </tr>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <AdminPageHeading subtitle="Main pages use the section editor (mockup layout) by default. Custom pages use the visual builder. You can switch main pages to the visual builder from their edit screen.">
          Pages
        </AdminPageHeading>
        <AdminSafeLink
          href="/admin/pages/new"
          className="inline-flex px-5 py-2.5 rounded-xl bg-[#B56244] text-white text-sm font-semibold hover:bg-[#9A4F35]"
        >
          + Custom page (visual builder)
        </AdminSafeLink>
      </div>

      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 space-y-1">
        <p>
          <strong className="text-[#152232]">Section editor</strong> — Home, About, and Contact mockup sections (services, work cards, team, etc.).
        </p>
        <p>
          <strong className="text-[#152232]">Visual builder</strong> — Freeform layout for custom pages, or advanced overrides on main pages.
        </p>
      </div>

      {mainPages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Main pages</h2>
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
              <tbody className="divide-y divide-gray-200">{mainPages.map(renderRow)}</tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Custom pages</h2>
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
              {customPages.map(renderRow)}
            </tbody>
          </table>
          {customPages.length === 0 && (
            <p className="p-8 text-center text-gray-500">No custom pages yet. Create one with the visual builder.</p>
          )}
        </div>
      </div>
    </div>
  )
}
