import Link from 'next/link'

export default function Wordmark({ siteName = 'digg', className = '' }: { siteName?: string; className?: string }) {
  const name = siteName.toLowerCase().replace(/\s+/g, '')
  return (
    <Link
      href="/"
      className={`font-black text-[1.5rem] sm:text-[1.75rem] tracking-[-0.04em] text-[var(--color-ink)] min-h-[44px] inline-flex items-center ${className}`}
      style={{ fontFamily: 'var(--font-heading)' }}
      aria-label={`${siteName} home`}
    >
      {name}
      <span className="text-[var(--color-coral)]">.</span>
    </Link>
  )
}
