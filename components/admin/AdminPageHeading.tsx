import React from 'react'

/**
 * Consistent page heading for the admin dashboard.
 * Uses the site heading font (Playfair Display) and DIGG navy.
 */
export default function AdminPageHeading({
  children,
  as: Tag = 'h1',
  subtitle,
  className = '',
}: {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  subtitle?: React.ReactNode
  className?: string
}) {
  const sizeClass = Tag === 'h1' ? 'text-3xl' : Tag === 'h2' ? 'text-2xl' : 'text-xl'
  return (
    <header className={className}>
      <Tag
        className={`font-bold text-[#1B2A6B] tracking-tight ${sizeClass}`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {children}
      </Tag>
      {subtitle && (
        <p className="mt-1 text-gray-500 text-sm font-normal">{subtitle}</p>
      )}
    </header>
  )
}
