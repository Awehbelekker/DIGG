import PageWrap from '@/components/public/ui/PageWrap'
import { BtnLead } from '@/components/public/ui/Buttons'

export default function CtaSection({
  kick,
  title,
  description,
  buttonText,
  buttonLink,
}: {
  kick?: string
  title: string
  description?: string
  buttonText: string
  buttonLink: string
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-[72px] bg-[var(--color-bone)]">
      <PageWrap className="text-center">
        {kick && (
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lead-deep)] mb-3">{kick}</p>
        )}
        <h2
          className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold tracking-tight text-[var(--color-ink)] max-w-2xl mx-auto mb-4 sm:mb-5 px-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-[var(--color-muted)] mb-6 max-w-xl mx-auto px-2 leading-relaxed">{description}</p>
        )}
        <div className="flex justify-center px-4 sm:px-0">
          <BtnLead href={buttonLink} className="max-w-sm sm:max-w-none">
            {buttonText}
          </BtnLead>
        </div>
      </PageWrap>
    </section>
  )
}
