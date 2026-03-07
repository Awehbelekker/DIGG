import PageEditor from '@/components/admin/PageEditor'
import AdminPageHeading from '@/components/admin/AdminPageHeading'

export default function NewPagePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading className="mb-8">Create New Page</AdminPageHeading>
      <PageEditor />
    </div>
  )
}
