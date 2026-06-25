import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/site-settings'
import Wordmark from '@/components/public/ui/Wordmark'

type NavLink = { href: string; label: string }

type FooterProps = {
  logoUrl?: string
  logoSize?: 'small' | 'medium' | 'large'
  logoPosition?: 'left' | 'center'
  links?: NavLink[]
  siteSettings?: SiteSettings
}

export default function Footer({ logoUrl = '', links = [], siteSettings = {} }: FooterProps) {
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

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-greige)] mt-6 sm:mt-8 pt-10 sm:pt-12 pb-[max(2.25rem,env(safe-area-inset-bottom))]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            {logoSrc ? (
              <Link href="/" className="inline-block mb-3">
                {logoSrc.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoSrc} alt={siteName} className="h-10 brightness-0 invert opacity-90" />
                ) : (
                  <Image src={logoSrc} alt={siteName} width={140} height={40} className="h-10 w-auto brightness-0 invert opacity-90" />
                )}
              </Link>
            ) : (
              <div className="mb-3 [&_a]:text-white [&_a]:text-[2rem]">
                <Wordmark siteName={siteName} />
              </div>
            )}
            <p className="text-xs uppercase tracking-wider mt-4">{pillars}</p>
          </div>
          <div>
            <h5 className="text-white text-xs uppercase tracking-widest mb-3 font-semibold">Pages</h5>
            {pageLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block text-sm py-1.5 min-h-[44px] flex items-center hover:text-[var(--color-coral)] transition-colors active:opacity-80">
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h5 className="text-white text-xs uppercase tracking-widest mb-3 font-semibold">Contact</h5>
            <a href={`mailto:${email}`} className="block text-sm py-1.5 min-h-[44px] hover:text-[var(--color-coral)] break-all sm:break-normal active:opacity-80">
              {email}
            </a>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="block text-sm py-1.5 min-h-[44px] hover:text-[var(--color-coral)] active:opacity-80">
              {phone}
            </a>
            <p className="text-sm">{location}</p>
          </div>
          <div>
            <h5 className="text-white text-xs uppercase tracking-widest mb-3 font-semibold">The practice</h5>
            <p className="text-sm mb-2">{companyLine}</p>
            <p className="text-sm">Property · Development · Architecture</p>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-2 sm:gap-3 text-xs text-[#7d8694]">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <span>Develop. Invest. Grow. Give.</span>
        </div>
        {showNewsletter && null}
        <Link href="/admin/login" className="inline-block mt-4 text-[10px] text-white/20 hover:text-white/40">
          Admin
        </Link>
      </div>
    </footer>
  )
}
