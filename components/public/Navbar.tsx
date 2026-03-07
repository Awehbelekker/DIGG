'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const LOGO_SIZE_CLASS = {
  small: 'h-8 w-auto sm:h-10',
  medium: 'h-14 w-auto sm:h-16',
  large: 'h-20 w-auto sm:h-24',
} as const

type NavbarProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative w-6 h-5 flex flex-col justify-between" aria-hidden>
      <span
        className={`block w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-out origin-center ${
          open ? 'rotate-45 translate-y-[7px]' : ''
        }`}
      />
      <span
        className={`block w-full h-0.5 bg-current rounded-full transition-all duration-200 ${
          open ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`block w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-out origin-center ${
          open ? '-rotate-45 -translate-y-[7px]' : ''
        }`}
      />
    </span>
  )
}

export default function Navbar({ logoUrl = '', logoSize = 'medium', logoPosition = 'left' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logoSrc = logoUrl && logoUrl.trim() ? logoUrl.trim() : '/logo/digg-logo.png'
  const sizeClass = LOGO_SIZE_CLASS[logoSize]
  const isExternalLogo = logoSrc.startsWith('http')

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/#products', label: 'Products' },
    { href: '/for-agents', label: 'For Agents' },
    { href: '/give', label: 'Give' },
    { href: '/contact', label: 'Contact' },
  ]

  const logoEl = (
    <Link
      href="/"
      className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 rounded shrink-0"
      aria-label="DIGG Home"
    >
      {isExternalLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          className={`${sizeClass} object-contain mix-blend-multiply dark:mix-blend-screen`}
        />
      ) : (
        <Image
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          width={280}
          height={96}
          className={`${sizeClass} object-contain mix-blend-multiply dark:mix-blend-screen`}
          priority
        />
      )}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 bg-[#1B2A6B]/80 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center h-24 ${logoPosition === 'center' ? 'justify-between' : ''}`}>
          {logoPosition === 'left' && logoEl}
          {logoPosition === 'center' && <div className="flex-1 min-w-0" />}
          {logoPosition === 'center' && logoEl}
          <div className={`hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-end min-w-0`}>
          <ul className="flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-2 px-3 lg:px-4 rounded-lg text-white hover:text-[#F7941D] hover:bg-white/10 font-medium text-sm lg:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2.5 -mr-2 text-white rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>

        {/* Mobile dropdown - separate block so layout is clear */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col py-4 gap-0.5 border-t border-white/10">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-3 px-4 rounded-lg text-white hover:text-[#F7941D] hover:bg-white/10 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
