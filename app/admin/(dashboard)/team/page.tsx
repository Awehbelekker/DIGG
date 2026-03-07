import AdminPageHeading from '@/components/admin/AdminPageHeading'
import TeamClient from './TeamClient'
import { listTeamUsers } from './actions'

export default async function AdminTeamPage() {
  const { users, error } = await listTeamUsers()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPageHeading
        className="mb-8"
        subtitle="Users who can sign in to the admin. Invite by email to add editors."
      >
        Team
      </AdminPageHeading>
      <TeamClient initialUsers={users} listError={error} />
    </div>
  )
}
