import PageWrap from '@/components/public/ui/PageWrap'
import Eyebrow from '@/components/public/ui/Eyebrow'

export default function PillarsPanel({
  kick,
  title,
  body,
}: {
  kick?: string
  title: string
  body: string
}) {
  return (
    <section className="section-y-tight bg-[var(--color-bone)]">
      <PageWrap>
        <div className="bg-[var(--color-ink)] rounded-2xl sm:rounded-[28px] p-6 sm:p-8 lg:p-12 text-[var(--color-bone)]">
          {kick && (
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-coral)] mb-3">{kick}</p>
          )}
          <h2
            className="text-2xl sm:text-[2.375rem] font-extrabold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
            dangerouslySetInnerHTML={{
              __html: title.replace(/\./g, '<span class="text-[var(--color-coral)]">.</span>'),
            }}
          />
          <p className="text-[var(--color-greige)] text-base max-w-2xl leading-relaxed">{body}</p>
        </div>
      </PageWrap>
    </section>
  )
}
