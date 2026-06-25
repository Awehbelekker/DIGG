import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/site-settings'
import Wordmark from '@/components/public/ui/Wordmark'
import { parsePillarWords } from '@/lib/parse-pillars'
import { logoImageClassName, logoWordmarkClassName, type LogoSize } from '@/lib/logo-size'

type NavLink = { href: string; label: string }

function FooterPillars({ pillars }: { pillars: string }) {
  const words = parsePillarWords(pillars)

  if (words.length === 0) return null

  return (
    <ul className="flex flex-col items-start gap-0 text-xs uppercase tracking-[0.18em] text-[var(--color-greige)]">
      {words.map((word, i) => (
        <li key={word + i} className="flex flex-col items-start">
          <span className="leading-tight">{word}</span>
          {i < words.length - 1 && (
            <span className="text-[var(--color-coral)] text-[10px] leading-none py-0.5 select-none" aria-hidden>
              ·
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-white text-xs uppercase tracking-widest font-semibold leading-none">
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
  const pillarWords = parsePillarWords(pillars)

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
    <Link href="/" className="inline-block">
      {logoSrc.startsWith('http') ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt={siteName} className={`${logoClass} brightness-0 invert opacity-90`} />
      ) : (
        <Image src={logoSrc} alt={siteName} width={200} height={64} className={`${logoClass} brightness-0 invert opacity-90`} />
      )}
    </Link>
  ) : (
    <div className={`[&_a]:text-white ${wordmarkClass}`}>
      <Wordmark siteName={siteName} />
    </div>
  )

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-greige)] pt-10 sm:pt-12 pb-[max(2.25rem,env(safe-area-inset-bottom))]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10 gap-y-8 lg:gap-y-4">
          {/* Brand */}
          <div className="flex flex-col gap-3 lg:contents">
            <div className="lg:col-start-1 lg:row-start-1">{logoBlock}</div>
            <div className="lg:col-start-1 lg:row-start-2 lg:pt-3">
              <FooterPillars pillars={pillars} />
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-3 lg:contents">
            <div className="lg:col-start-2 lg:row-start-1">
              <FooterHeading>Pages</FooterHeading>
            </div>
            <div className="lg:col-start-2 lg:row-start-2 lg:pt-3">
              {pageLinks.map((l) => (
                <Link key={l.href} href={l.href} className={footerLinkClassName()}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 lg:contents">
            <div className="lg:col-start-3 lg:row-start-1">
              <FooterHeading>Contact</FooterHeading>
            </div>
            <div className="lg:col-start-3 lg:row-start-2 lg:pt-3">
              <a href={`mailto:${email}`} className={`${footerLinkClassName()} break-all sm:break-normal`}>
                {email}
              </a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className={footerLinkClassName()}>
                {phone}
              </a>
              <p className="text-sm leading-snug py-0.5 sm:py-1">{location}</p>
            </div>
          </div>

          {/* The practice */}
          <div className="flex flex-col gap-3 lg:contents">
            <div className="lg:col-start-4 lg:row-start-1">
              <FooterHeading>The practice</FooterHeading>
            </div>
            <div className="lg:col-start-4 lg:row-start-2 lg:pt-3 space-y-1.5 text-sm leading-relaxed">
              <p>{companyLine}</p>
              <p>Property · Development · Architecture</p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-2 sm:gap-3 text-xs text-[#7d8694]">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          {pillarWords.length > 0 && (
            <span className="hidden sm:inline-flex sm:items-center sm:gap-1.5">
              {pillarWords.map((word, i) => (
                <span key={word + i}>
                  {word}
                  {i < pillarWords.length - 1 && <span className="text-[var(--color-coral)] mx-0.5">·</span>}
                </span>
              ))}
            </span>
          )}
        </div>
        {showNewsletter && null}
        <Link href="/admin/login" className="inline-block mt-4 text-[10px] text-white/20 hover:text-white/40">
          Admin
        </Link>
      </div>
    </footer>
  )
}
