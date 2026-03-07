import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LOGO_SIZE_CLASS = {
  small: 'h-8 w-auto',
  medium: 'h-12 w-auto',
  large: 'h-16 w-auto',
} as const

type FooterProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
}

export default function Footer({ logoUrl = '', logoSize = 'medium', logoPosition = 'left' }: FooterProps) {
  const logoSrc = logoUrl && logoUrl.trim() ? logoUrl.trim() : '/logo/digg-logo.png'
  const sizeClass = FOOTER_LOGO_SIZE_CLASS[logoSize]
  const isExternalLogo = logoSrc.startsWith('http')

  const logoBlock = (
    <Link href="/" className="inline-block mb-3" aria-label="DIGG Home">
      {isExternalLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          className={`${sizeClass} object-contain brightness-0 invert opacity-95`}
        />
      ) : (
        <Image
          src={logoSrc}
          alt="DIGG — Develop · Invest · Grow · Give"
          width={160}
          height={56}
          className={`${sizeClass} object-contain brightness-0 invert opacity-95`}
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
          <nav className={`flex flex-wrap gap-6 text-sm ${logoPosition === 'center' ? 'justify-center' : ''}`} aria-label="Footer">
            <Link href="/about" className="text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B] rounded">
              About
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B] rounded">
              Contact
            </Link>
            <Link href="/for-agents" className="text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B] rounded">
              For Agents
            </Link>
          </nav>
        </div>
        <p className="text-sm text-white/60 mt-10 pt-8 border-t border-white/10">
          &copy; {new Date().getFullYear()} DIGG Architecture. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
