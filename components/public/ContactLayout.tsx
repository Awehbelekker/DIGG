import PageWrap from '@/components/public/ui/PageWrap'
import Eyebrow from '@/components/public/ui/Eyebrow'
import ContactForm from '@/components/public/ContactForm'
import type { SiteSettings } from '@/lib/site-settings'
import { buildTelHref, buildWhatsAppUrl } from '@/lib/contact-utils'

type ContactLayoutProps = {
  kick?: string
  title: string
  intro: string
  siteSettings?: SiteSettings
  submitText?: string
  reassurance?: string
  formAnchorId?: string
}

export default function ContactLayout({
  kick = 'Contact',
  title,
  intro,
  siteSettings = {},
  submitText,
  reassurance,
  formAnchorId = 'contact-form',
}: ContactLayoutProps) {
  const email = siteSettings.contact_email?.trim() || 'judy@digg-ct.co.za'
  const phone = siteSettings.phone?.trim() || '082 707 7080'
  const location = siteSettings.location?.trim() || 'Bloubergstrand, Cape Town'
  const wa = buildWhatsAppUrl(phone, siteSettings.whatsapp_message || '')

  const details = [
    { icon: '✉️', label: 'Email', value: email, href: `mailto:${email}` },
    { icon: '📞', label: 'Phone', value: phone, href: buildTelHref(phone) },
    { icon: '💬', label: 'WhatsApp', value: 'Message us directly', href: wa, wa: true },
    { icon: '📍', label: 'Studio', value: location },
  ]

  return (
    <section className="page-top pb-12 sm:pb-16 bg-[var(--color-bone)]">
      <PageWrap>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <Eyebrow className="mb-4 sm:mb-6">{kick}</Eyebrow>
            <h1
              className="text-[clamp(2rem,6vw,3.375rem)] font-extrabold tracking-tight leading-[1.05] mb-4 sm:mb-5 text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title.replace(/\.$/, '')}
              <span className="text-[var(--color-coral)]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#3a4654] leading-relaxed mb-6 sm:mb-7 whitespace-pre-line">{intro}</p>
            <div className="space-y-3 sm:space-y-4">
              {details.map((d) => (
                <div key={d.label} className="flex items-center gap-3 sm:gap-3.5 min-h-[52px]">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${d.wa ? 'bg-[#25D366]' : d.label === 'Studio' ? 'bg-[var(--color-greige)]' : 'bg-[var(--color-lead)]'}`}
                  >
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{d.label}</p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="font-semibold text-[var(--color-ink)] hover:text-[var(--color-lead)] break-all sm:break-normal active:opacity-80"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-[var(--color-ink)]">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id={formAnchorId} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-[var(--color-greige)]/50 lg:sticky lg:top-24">
            <ContactForm submitText={submitText} reassurance={reassurance} embedded />
          </div>
        </div>
      </PageWrap>
    </section>
  )
}
