import Link from 'next/link'

const btnBase =
  'inline-flex items-center justify-center gap-2 min-h-[48px] px-6 sm:px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] motion-reduce:active:scale-100 w-full sm:w-auto'

type BtnProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function BtnPrimary({ href, children, className = '' }: BtnProps) {
  return (
    <Link
      href={href}
      className={`${btnBase} bg-[var(--color-ink)] text-[var(--color-bone)] md:hover:-translate-y-0.5 md:hover:shadow-lg ${className}`}
    >
      {children}
    </Link>
  )
}

export function BtnLead({ href, children, className = '' }: BtnProps) {
  return (
    <Link
      href={href}
      className={`${btnBase} bg-[var(--color-lead)] text-white md:hover:bg-[var(--color-lead-deep)] md:hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </Link>
  )
}

export function BtnGhost({ href, children, className = '' }: BtnProps) {
  return (
    <Link
      href={href}
      className={`${btnBase} bg-transparent border-[1.5px] border-[var(--color-greige)] text-[var(--color-ink)] md:hover:border-[var(--color-lead)] md:hover:text-[var(--color-lead-deep)] ${className}`}
    >
      {children}
    </Link>
  )
}
