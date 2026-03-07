'use client'

import Link from 'next/link'

type Filter = 'all' | 'unread' | 'read' | 'archived'

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
]

export default function FormFilterTabs({ current }: { current: Filter }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      {TABS.map(({ value, label }) => (
        <Link
          key={value}
          href={value === 'all' ? '/admin/forms' : `/admin/forms?filter=${value}`}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            current === value
              ? 'bg-white text-[#1B2A6B] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
