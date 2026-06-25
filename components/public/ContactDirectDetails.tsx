import type { SiteSettings } from '@/lib/site-settings'
import { COMPANY_LINE } from '@/lib/brand'
import { buildTelHref, buildWhatsAppUrl } from '@/lib/contact-utils'

type ContactDirectDetailsProps = {
  siteSettings?: SiteSettings
}

export default function ContactDirectDetails({ siteSettings = {} }: ContactDirectDetailsProps) {
  const phone = siteSettings.phone?.trim() || '082 707 7080'
  const email = siteSettings.contact_email?.trim() || 'judy@digg-ct.co.za'
  const location = siteSettings.location?.trim() || 'Cape Town, South Africa'
  const companyLine = siteSettings.company_line?.trim() || COMPANY_LINE
  const waMessage =
    siteSettings.whatsapp_message?.trim() ||
    "Hi DIGG, I'd like to talk about a project."
  const whatsappUrl = buildWhatsAppUrl(phone, waMessage)
  const instagramUrl = siteSettings.instagram_url?.trim()

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-[var(--color-greige)]/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3 text-center sm:text-left">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-2">Email</h3>
            <a
              href={`mailto:${email}`}
              className="font-medium text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)] break-all"
            >
              {email}
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-2">Phone</h3>
            <a
              href={buildTelHref(phone)}
              className="font-medium text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)]"
            >
              {phone}
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-2">Where</h3>
            <p className="text-[var(--color-ink)] font-medium">{location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-8">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-95 transition-opacity"
            >
              Chat on WhatsApp
            </a>
          ) : null}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-semibold hover:bg-[var(--color-ink)] hover:text-white transition-colors"
            >
              Instagram
            </a>
          ) : null}
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-8 text-center sm:text-left">{companyLine}</p>
      </div>
    </section>
  )
}
