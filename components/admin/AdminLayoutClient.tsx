'use client'

import AdminNav from '@/components/admin/AdminNav'
import { AdminUnsavedProvider } from '@/components/admin/AdminUnsavedProvider'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminUnsavedProvider>
      <AdminNav />
      <main className="py-8">{children}</main>
    </AdminUnsavedProvider>
  )
}
