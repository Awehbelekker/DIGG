import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import FormExportButton from '@/components/admin/FormExportButton'

export default async function AdminFormsPage() {
  const supabase = await createClient()
  const { data: submissions, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <AdminPageHeading subtitle="Contact and agent registration submissions.">Form Submissions</AdminPageHeading>
        <FormExportButton />
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {submissions.map((submission: any) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/forms/${submission.id}`}
                        className="text-lg font-semibold text-[#1B2A6B] hover:text-[#F7941D] transition-colors"
                      >
                        {submission.data.name || 'Unknown'}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.form_type === 'contact'
                          ? 'bg-[#5BC8E8] text-[#1B2A6B]'
                          : 'bg-[#F7941D] text-white'
                      }`}>
                        {submission.form_type === 'contact' ? 'Contact' : 'Agent'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/forms/${submission.id}`}
                    className="px-3 py-1.5 text-sm font-medium text-[#F7941D] hover:bg-[#F7941D]/10 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                </div>
                <div className="mt-4 space-y-2">
                  {Object.entries(submission.data).map(([key, value]: [string, any]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>{' '}
                      <span className="text-gray-600">{String(value || 'N/A')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No form submissions yet</p>
        </div>
      )}
    </div>
  )
}
