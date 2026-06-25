import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/site-settings'
import Wordmark from '@/components/public/ui/Wordmark'
import { parsePillarWords } from '@/lib/parse-pillars'
import { logoImageClassName, logoWordmarkClassName, type LogoSize } from '@/lib/logo-size'

type NavLink = { href: string; label: string }

function FooterPillarsInline({ pillars }: { pillars: string }) {
  const words = parsePillarWords(pillars)

  if (words.length === 0) return null

  return (
    <p className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs uppercase tracking-[0.18em] text-[var(--color-greige)]">
      {words.map((word, i) => (
        <span key={word + i} className="inline-flex items-center gap-3 sm:gap-4">
          {word}
          {i < words.length - 1 && (
            <span className="text-[var(--color-coral)] select-none" aria-hidden>
              ·
            </span>
          )}
        </span>
      ))}
    </p>
  )
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-white text-xs uppercase tracking-widest font-semibold leading-none mb-3">
      {children}
    </h5>
  )
}

function footerLinkClassName() {
  return 'text-sm leading-snug py-1.5 min-h-[44px] sm:min-h-0 sm:py-0.5 flex items-center hover:text-[var(--color-coral)] transition-colors active:opacity-80'
}

type FooterProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
  links?: NavLink[]
  siteSettings?: SiteSettings
}

export default function Footer({
  logoUrl = '',
  logoSize = 'medium',
  links = [],
  siteSettings = {},
}: FooterProps) {
  const siteName = siteSettings.site_name?.trim() || 'digg'
  const email = siteSettings.contact_email?.trim() || 'judy@digg-ct.co.za'
  const phone = siteSettings.phone?.trim() || '082 707 7080'
  const location = siteSettings.location?.trim() || 'Bloubergstrand, Cape Town'
  const pillars = siteSettings.pillars?.trim() || 'Develop · Invest · Grow · Give'
  const companyLine = siteSettings.company_line?.trim() || 'Aweh Be Lekker (Pty) Ltd · Reg 2024/537986/07'
  const showNewsletter = siteSettings.footer_newsletter_enabled === true

  const pageLinks =
    links.length > 0
      ? links
      : [
          { href: '/', label: 'Home' },
          { href: '/insights', label: 'Work' },
          { href: '/about', label: 'About' },
          { href: '/contact', label: 'Contact' },
        ]

  const logoSrc = logoUrl?.trim()
  const size = (logoSize || 'medium') as LogoSize
  const logoClass = logoImageClassName(size, 'footer')
  const wordmarkClass = logoWordmarkClassName(size, 'footer')

  const logoBlock = logoSrc ? (
    <Link href="/" className="inline-block shrink-0">
      {logoSrc.startsWith('http') ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt={siteName} className={`${logoClass} brightness-0 invert opacity-90`} />
      ) : (
        <Image src={logoSrc} alt={siteName} width={200} height={64} className={`${logoClass} brightness-0 invert opacity-90`} />
      )}
    </Link>
  ) : (
    <div className={`shrink-0 [&_a]:text-white ${wordmarkClass}`}>
      <Wordmark siteName={siteName} />
    </div>
  )

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-greige)] pt-10 sm:pt-12 pb-[max(2.25rem,env(safe-area-inset-bottom))]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-7">
        {/* Row 1 — brand + pillars */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 pb-8 sm:pb-10 border-b border-white/10">
          {logoBlock}
          <FooterPillarsInline pillars={pillars} />
        </div>

        {/* Row 2 — link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pt-8 sm:pt-10">
          <div>
            <FooterHeading>Pages</FooterHeading>
            {pageLinks.map((l) => (
              <Link key={l.href} href={l.href} className={footerLinkClassName()}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <FooterHeading>Contact</FooterHeading>
            <a href={`mailto:${email}`} className={`${footerLinkClassName()} break-all sm:break-normal`}>
              {email}
            </a>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className={footerLinkClassName()}>
              {phone}
            </a>
            <p className="text-sm leading-snug py-0.5 sm:py-1">{location}</p>
          </div>
          <div>
            <FooterHeading>The practice</FooterHeading>
            <div className="space-y-1.5 text-sm leading-relaxed">
              <p>{companyLine}</p>
              <p>Property · Development · Architecture</p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 text-xs text-[#7d8694]">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
        </div>
        {showNewsletter && null}
        <Link href="/admin/login" className="inline-block mt-4 text-[10px] text-white/20 hover:text-white/40">
          Admin
        </Link>
      </div>
    </footer>
  )
}
