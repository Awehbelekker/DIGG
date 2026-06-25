'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Wordmark from '@/components/public/ui/Wordmark'

type NavLink = { href: string; label: string }

type NavbarProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
  phoneNumber?: string
  links?: NavLink[]
  siteName?: string
  navCtaText?: string
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative w-6 h-5 flex flex-col justify-between" aria-hidden>
      <span className={`block w-full h-0.5 bg-current rounded-full transition-all ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
      <span className={`block w-full h-0.5 bg-current rounded-full transition-all ${open ? 'opacity-0' : ''}`} />
      <span className={`block w-full h-0.5 bg-current rounded-full transition-all ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
    </span>
  )
}

const DEFAULT_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/insights', label: 'Work' },
  { href: '/about', label: 'About' },
]

export default function Navbar({
  logoUrl = '',
  siteName = 'digg',
  navCtaText = "Let's talk",
  links,
}: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = links && links.length > 0 ? links.filter((l) => l.href !== '/contact') : DEFAULT_LINKS
  const logoSrc = logoUrl?.trim() || ''
  const isExternal = logoSrc.startsWith('http')

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const logoEl = logoSrc ? (
    <Link href="/" className="shrink-0 min-h-[44px] flex items-center" aria-label="Home">
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt={siteName} className="h-9 sm:h-10 w-auto object-contain" />
      ) : (
        <Image src={logoSrc} alt={siteName} width={140} height={48} className="h-9 sm:h-10 w-auto object-contain" priority />
      )}
    </Link>
  ) : (
    <Wordmark siteName={siteName} />
  )

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bone)]/90 backdrop-blur-md border-b border-[var(--color-greige)]/50 [padding-top:env(safe-area-inset-top)]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-7">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {logoEl}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-full transition-colors ${
                  isActive(href)
                    ? 'bg-[var(--color-ink)] text-[var(--color-bone)]'
                    : 'text-[var(--color-ink)] hover:bg-[var(--color-lead)]/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`text-sm font-semibold px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-full transition-colors ml-1 ${
                isActive('/contact')
                  ? 'bg-[var(--color-lead-deep)] text-white'
                  : 'bg-[var(--color-lead)] text-white hover:bg-[var(--color-lead-deep)]'
              }`}
            >
              {navCtaText}
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-[var(--color-ink)] rounded-xl active:bg-[var(--color-lead)]/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
        {mobileOpen && (
          <ul className="md:hidden pb-4 flex flex-col gap-1.5 border-t border-[var(--color-greige)]/40 pt-3 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3.5 px-4 min-h-[48px] rounded-xl font-semibold ${
                    isActive(href) ? 'bg-[var(--color-ink)] text-[var(--color-bone)]' : 'text-[var(--color-ink)] active:bg-[var(--color-lead)]/10'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block py-3.5 px-4 min-h-[48px] rounded-xl font-semibold bg-[var(--color-lead)] text-white text-center active:bg-[var(--color-lead-deep)]"
              >
                {navCtaText}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
