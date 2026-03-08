'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

type EditorTopBarProps = {
  title: string
  onTitleChange: (title: string) => void
  device: DeviceMode
  onDeviceChange: (device: DeviceMode) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  published: boolean
  onPublishedChange: (published: boolean) => void
  saving: boolean
  onSave: () => void
  onOpenSettings: () => void
  hasUnsaved: boolean
}

export default function EditorTopBar({
  title,
  onTitleChange,
  device,
  onDeviceChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  published,
  onPublishedChange,
  saving,
  onSave,
  onOpenSettings,
  hasUnsaved,
}: EditorTopBarProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTitle) titleRef.current?.select()
  }, [editingTitle])

  const devices: { mode: DeviceMode; icon: string; label: string; w: string }[] = [
    { mode: 'desktop', icon: '🖥', label: 'Desktop', w: '100%' },
    { mode: 'tablet', icon: '📱', label: 'Tablet', w: '768px' },
    { mode: 'mobile', icon: '📲', label: 'Mobile', w: '375px' },
  ]

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm z-50 flex-shrink-0">
      {/* Left: Back + title */}
      <Link
        href="/admin/pages"
        className="flex items-center gap-1 text-gray-500 hover:text-[#1B2A6B] transition-colors flex-shrink-0"
        title="Back to pages"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {editingTitle ? (
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={() => setEditingTitle(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false) }}
          className="text-sm font-semibold text-[#1B2A6B] bg-transparent border-b-2 border-[#F7941D] outline-none px-1 py-0.5 min-w-[120px] max-w-[240px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingTitle(true)}
          className="text-sm font-semibold text-[#1B2A6B] hover:text-[#F7941D] transition-colors truncate max-w-[240px] text-left"
          title="Click to rename"
        >
          {title || 'Untitled page'}
          {hasUnsaved && <span className="ml-1.5 w-2 h-2 rounded-full bg-[#F7941D] inline-block" />}
        </button>
      )}

      {/* Center: Device toggle */}
      <div className="flex-1 flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {devices.map((d) => (
            <button
              key={d.mode}
              type="button"
              onClick={() => onDeviceChange(d.mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                device === d.mode
                  ? 'bg-white text-[#1B2A6B] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={`${d.label} (${d.w})`}
            >
              <span className="mr-1">{d.icon}</span>{d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          title="Page settings (slug, SEO)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onPublishedChange(!published)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
            published
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {published ? 'Published' : 'Draft'}
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-1.5 bg-[#F7941D] text-white rounded-lg text-sm font-semibold hover:bg-[#e6850a] transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  )
}
