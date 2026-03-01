export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1B2A6B] mb-4">Test Page</h1>
        <p className="text-gray-600">If you can see this, routing works!</p>
        <p className="text-sm text-gray-500 mt-4">
          Environment: {process.env.NODE_ENV}
        </p>
        <p className="text-sm text-gray-500">
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌'}
        </p>
      </div>
    </div>
  )
}
