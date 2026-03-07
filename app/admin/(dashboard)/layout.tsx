import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { ToastProvider } from '@/components/admin/Toast'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAFAFA]">
        <AdminNav />
        <main className="py-8">{children}</main>
      </div>
    </ToastProvider>
  )
}
