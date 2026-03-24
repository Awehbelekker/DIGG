import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import AdminSafeLink from '@/components/admin/AdminSafeLink'

export const dynamic = 'force-dynamic'

export default async function VisualBuilderPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })

  if (pages && pages.length > 0) {
    redirect(`/admin/pages/${pages[0].id}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-[#F7941D] to-[#e6850a] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      </div>
      <AdminPageHeading subtitle="Start building your website with the drag-and-drop visual editor.">
        Visual Builder
      </AdminPageHeading>
      <AdminSafeLink
        href="/admin/pages/new"
        className="inline-block mt-8 bg-[#F7941D] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e6850a] transition-colors text-lg"
      >
        Create Your First Page
      </AdminSafeLink>
    </div>
  )
}
