import { createClient } from '@/lib/supabase/server'
import AdminSafeLink from '@/components/admin/AdminSafeLink'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import FormExportButton from '@/components/admin/FormExportButton'
import FormFilterTabs from '@/components/admin/FormFilterTabs'
import FormSubmissionRow from '@/components/admin/FormSubmissionRow'
import type { FormSubmission } from '@/lib/types/database'

type Filter = 'all' | 'unread' | 'read' | 'archived'

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter: rawFilter } = await searchParams
  const filter: Filter = rawFilter === 'unread' || rawFilter === 'read' || rawFilter === 'archived' ? rawFilter : 'all'

  const supabase = await createClient()
  let query = supabase.from('form_submissions').select('*').order('created_at', { ascending: false })
  if (filter === 'unread') query = query.eq('read', false).eq('archived', false)
  else if (filter === 'read') query = query.eq('read', true).eq('archived', false)
  else if (filter === 'archived') query = query.eq('archived', true)
  const { data: submissions } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <AdminPageHeading subtitle="Contact and agent registration submissions.">Form Submissions</AdminPageHeading>
        <FormExportButton />
      </div>

      <FormFilterTabs current={filter} />

      {submissions && submissions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          <div className="divide-y divide-gray-200">
            {(submissions as FormSubmission[]).map((submission) => (
              <FormSubmissionRow key={submission.id} submission={submission} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mt-4">
          <p className="text-gray-500">No form submissions in this view</p>
          {filter !== 'all' && (
            <AdminSafeLink href="/admin/forms" className="mt-2 inline-block text-[#F7941D] hover:underline text-sm">
              View all
            </AdminSafeLink>
          )}
        </div>
      )}
    </div>
  )
}
