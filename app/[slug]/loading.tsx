export default function SlugLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#F7941D] border-t-transparent rounded-full animate-spin" aria-hidden />
        <p className="text-gray-500 text-sm">Loading page…</p>
      </div>
    </div>
  )
}
