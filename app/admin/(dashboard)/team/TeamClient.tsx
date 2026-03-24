'use client'

import { useMemo, useState } from 'react'
import { inviteUserByEmail, type TeamUser } from './actions'
import { useRegisterAdminNavUnsaved } from '@/components/admin/AdminUnsavedProvider'
import { useUnsavedChangesAlert } from '@/lib/hooks/useUnsavedChangesAlert'

export default function TeamClient({
  initialUsers,
  listError,
}: {
  initialUsers: TeamUser[]
  listError: string | null
}) {
  const [users, setUsers] = useState<TeamUser[]>(initialUsers)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const inviteDraftDirty = useMemo(() => email.trim().length > 0, [email])
  useRegisterAdminNavUnsaved(inviteDraftDirty)
  useUnsavedChangesAlert(
    inviteDraftDirty,
    'You have an email address in the invite field. Leave without sending?'
  )

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setLoading(true)
    setMessage(null)
    const { error } = await inviteUserByEmail(trimmed)
    if (error) {
      setMessage({ type: 'err', text: error })
    } else {
      setMessage({ type: 'ok', text: `Invite sent to ${trimmed}. They can set a password via the link in the email.` })
      setEmail('')
      const { users: next } = await import('./actions').then((a) => a.listTeamUsers())
      setUsers(next)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {listError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          {listError}
          <span className="block mt-1 text-red-600">Ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment.</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invite user</h2>
        <p className="text-sm text-gray-500 mb-4">
          They will receive an email to set a password and sign in at /admin/login.
        </p>
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[200px]">
            <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#F7941D] text-white rounded-lg font-medium hover:bg-[#e6850a] disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send invite'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-3 px-3 py-2 rounded-lg text-sm ${message.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Admin users</h2>
        </div>
        {users.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500 text-sm">No users yet. Send an invite above.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <span className="font-medium text-gray-900">{u.email ?? '(no email)'}</span>
                  <span className="text-gray-500 text-sm ml-2">Signed up {new Date(u.created_at).toLocaleDateString()}</span>
                </div>
                {u.last_sign_in_at && (
                  <span className="text-xs text-gray-400">Last sign-in {new Date(u.last_sign_in_at).toLocaleString()}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
