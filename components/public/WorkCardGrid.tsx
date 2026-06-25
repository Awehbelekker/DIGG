import Link from 'next/link'
import PageWrap from '@/components/public/ui/PageWrap'
import WorkCard, { type WorkCardItem } from '@/components/public/WorkCard'

export default function WorkCardGrid({
  kick,
  title,
  sideLinkText,
  sideLinkHref,
  items,
  whiteBg = false,
}: {
  kick?: string
  title: string
  sideLinkText?: string
  sideLinkHref?: string
  items: WorkCardItem[]
  whiteBg?: boolean
}) {
  return (
    <section className={`py-12 sm:py-16 lg:py-[72px] ${whiteBg ? 'bg-white' : 'bg-[var(--color-bone)]'}`}>
      <PageWrap>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-7">
          <div>
            {kick && (
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lead-deep)] mb-2">{kick}</p>
            )}
            <h2
              className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold tracking-tight text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h2>
          </div>
          {sideLinkText && sideLinkHref && (
            <Link
              href={sideLinkHref}
              className="text-sm font-bold text-[var(--color-lead-deep)] md:hover:underline shrink-0 min-h-[44px] inline-flex items-center active:opacity-80"
            >
              {sideLinkText}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {items.map((item, i) => (
            <WorkCard key={i} item={item} />
          ))}
        </div>
      </PageWrap>
    </section>
  )
}
