import AdminPageHeading from '@/components/admin/AdminPageHeading'
import InsightEditor from '@/components/admin/InsightEditor'

export default function NewInsightPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8">New Insight</AdminPageHeading>
      <InsightEditor />
    </div>
  )
}
