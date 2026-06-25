import { Suspense } from 'react'
import AdminLoginForm from '@/app/admin/login/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F4F0E8]">
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
