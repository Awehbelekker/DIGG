export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B2A6B] mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
