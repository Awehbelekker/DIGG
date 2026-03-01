import { createClient } from '@/lib/supabase/server'

export default async function AdminFormsPage() {
  const supabase = await createClient()
  const { data: submissions, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#1B2A6B] mb-8">Form Submissions</h1>

      {submissions && submissions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {submissions.map((submission: any) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-[#1B2A6B]">
                        {submission.data.name || 'Unknown'}
                      </h3>
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
