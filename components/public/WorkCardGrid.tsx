import Link from 'next/link'
import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
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
  const sideLink =
    sideLinkText && sideLinkHref ? (
      <Link
        href={sideLinkHref}
        className="text-sm font-bold text-[var(--color-lead-deep)] md:hover:underline shrink-0 min-h-[44px] inline-flex items-center active:opacity-80"
      >
        {sideLinkText}
      </Link>
    ) : undefined

  return (
    <section className={`section-y ${whiteBg ? 'bg-white' : 'bg-[var(--color-bone)]'}`}>
      <PageWrap>
        <SectionHead kick={kick} title={title} side={sideLink} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {items.map((item, i) => (
            <WorkCard key={i} item={item} />
          ))}
        </div>
      </PageWrap>
    </section>
  )
}
