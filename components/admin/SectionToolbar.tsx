'use client'

type SectionToolbarProps = {
  index: number
  total: number
  label: string
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
  onSettings: () => void
  onDragStart: (e: React.DragEvent) => void
}

export default function SectionToolbar({
  index,
  total,
  label,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
  onDragStart,
}: SectionToolbarProps) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur border border-gray-200 shadow-lg rounded-xl px-1 py-0.5">
        {/* Drag handle */}
        <button
          type="button"
          draggable
          onDragStart={onDragStart}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>

        <div className="w-px h-5 bg-gray-200" />

        <span className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider select-none">{label}</span>

        <div className="w-px h-5 bg-gray-200" />

        {/* Move up */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 rounded-lg text-gray-500 hover:text-[#1B2A6B] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Move up"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Move down */}
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1.5 rounded-lg text-gray-500 hover:text-[#1B2A6B] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Move down"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1.5 rounded-lg text-gray-500 hover:text-[#1B2A6B] hover:bg-gray-100 transition-colors"
          title="Duplicate section"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onSettings}
          className="p-1.5 rounded-lg text-gray-500 hover:text-[#F7941D] hover:bg-orange-50 transition-colors"
          title="Section settings"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => { if (confirm('Remove this section?')) onDelete() }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete section"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
