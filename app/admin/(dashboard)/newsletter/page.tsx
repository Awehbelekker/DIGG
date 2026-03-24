import { createClient } from '@/lib/supabase/server'
import AdminPageHeading from '@/components/admin/AdminPageHeading'
import NewsletterExportButton from '@/components/admin/NewsletterExportButton'
import type { NewsletterSignup } from '@/lib/types/database'

export default async function AdminNewsletterPage() {
  const supabase = await createClient()
  const { data: signups } = await supabase
    .from('newsletter_signups')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <AdminPageHeading subtitle="Emails collected from the footer signup form.">Newsletter signups</AdminPageHeading>
        <NewsletterExportButton />
      </div>

      {signups && signups.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(signups as NewsletterSignup[]).map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.source ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No newsletter signups yet</p>
          <p className="text-sm text-gray-400 mt-1">Signups from the footer form will appear here.</p>
        </div>
      )}
    </div>
  )
}
