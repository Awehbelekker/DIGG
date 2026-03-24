'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCallback, useState } from 'react'
import { useAdminNavUnsavedFlag } from '@/components/admin/AdminUnsavedProvider'

const LEAVE_MSG = 'You have unsaved changes. Leave without saving?'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const navUnsaved = useAdminNavUnsavedFlag()

  const tryNavigate = useCallback(
    (href: string) => {
      if (href === pathname) return
      if (!navUnsaved || globalThis.confirm(LEAVE_MSG)) {
        router.push(href)
      }
    },
    [navUnsaved, pathname, router]
  )

  const handleLogout = async () => {
    if (navUnsaved && !globalThis.confirm(LEAVE_MSG)) return
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/pages', label: 'Visual Builder' },
    { href: '/admin/insights', label: 'Insights' },
    { href: '/admin/images', label: 'Images' },
    { href: '/admin/forms', label: 'Form Submissions' },
    { href: '/admin/newsletter', label: 'Newsletter' },
    { href: '/admin/team', label: 'Team' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  return (
    <nav className="bg-[#1B2A6B] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (!navUnsaved || item.href === pathname) return
                  e.preventDefault()
                  tryNavigate(item.href)
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[#F7941D] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-red-600 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}
