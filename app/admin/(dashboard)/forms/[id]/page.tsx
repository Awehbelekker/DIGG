import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import FormSubmissionActions from '@/components/admin/FormSubmissionActions'
import type { FormSubmission } from '@/lib/types/database'

export default async function FormSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: submission, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !submission) notFound()

  const sub = submission as FormSubmission
  const data = (sub.data || {}) as Record<string, unknown>
  const formType = sub.form_type || 'contact'
  const createdAt = sub.created_at

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/forms"
          className="text-sm text-[#F7941D] hover:text-[#e6850a] font-medium"
        >
          ← Back to Form Submissions
        </Link>
        <FormSubmissionActions submission={sub} />
      </div>
      <AdminPageHeading className="mb-8" subtitle="View submission details">
        Form Submission
      </AdminPageHeading>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1B2A6B]" style={{ fontFamily: 'var(--font-heading)' }}>
              {String(data.name || 'Unknown')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              formType === 'contact'
                ? 'bg-[#5BC8E8] text-[#1B2A6B]'
                : 'bg-[#F7941D] text-white'
            }`}
          >
            {formType === 'contact' ? 'Contact' : 'Agent'}
          </span>
        </div>
        <dl className="divide-y divide-gray-100">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-700 capitalize shrink-0 sm:w-40">
                {key.replace(/_/g, ' ')}
              </dt>
              <dd className="text-sm text-gray-900 mt-0.5 sm:mt-0 whitespace-pre-wrap break-words">
                {String(value ?? '—')}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
