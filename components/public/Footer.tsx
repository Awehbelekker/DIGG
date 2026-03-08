import Link from 'next/link'
import Image from 'next/image'
import NewsletterSignup from '@/components/public/NewsletterSignup'

const FOOTER_LOGO_SIZE_CLASS = {
  small: 'h-8 w-auto',
  medium: 'h-12 w-auto',
  large: 'h-16 w-auto',
} as const

type NavLink = { href: string; label: string }

type FooterProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
  links?: NavLink[]
}

export default function Footer({ logoUrl = '', logoSize = 'medium', logoPosition = 'left', links = [] }: FooterProps) {
  const logoSrc = logoUrl && logoUrl.trim() ? logoUrl.trim() : '/logo/digg-logo.png'
  const sizeClass = FOOTER_LOGO_SIZE_CLASS[logoSize]
  const isExternalLogo = logoSrc.startsWith('http')

  const logoBlock = (
    <Link href="/" className="inline-flex items-center mb-3" aria-label="DIGG Home">
      {isExternalLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          className={`${sizeClass} object-contain rounded-lg`}
        />
      ) : (
        <Image
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          width={160}
          height={56}
          className={`${sizeClass} object-contain rounded-lg`}
        />
      )}
    </Link>
  )

  return (
    <footer className="bg-[#1B2A6B] text-white mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className={`flex flex-col md:flex-row md:items-center gap-8 ${logoPosition === 'center' ? 'md:flex-col md:text-center' : 'md:justify-between'}`}>
          <div className={logoPosition === 'center' ? 'flex flex-col items-center' : ''}>
            {logoBlock}
            <p className="text-white/80 text-sm">Cape Town, South Africa</p>
          </div>
          <nav className={`flex flex-wrap gap-4 sm:gap-6 text-sm ${logoPosition === 'center' ? 'justify-center' : ''}`} aria-label="Footer">
            {(links.length > 0 ? links.filter(l => l.href !== '/') : [
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ]).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-[44px] flex items-center py-2 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B] rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-sm text-white/80 mb-3">Stay in the loop — property insights and updates.</p>
          <NewsletterSignup source="footer" />
        </div>
        <p className="text-xs sm:text-sm text-white/60 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
          &copy; {new Date().getFullYear()} DIGG Architecture. All rights reserved.
        </p>
        <p className="text-xs text-white/50 mt-2" aria-hidden>
          Cape Town architecture &amp; property design — income-generating solutions.
        </p>
        <Link
          href="/admin/login"
          className="inline-block mt-3 text-[10px] text-white/20 hover:text-white/50 transition-colors"
          aria-label="Admin"
        >
          Admin
        </Link>
      </div>
    </footer>
  )
}
