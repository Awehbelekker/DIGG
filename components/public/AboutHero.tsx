import PageWrap from '@/components/public/ui/PageWrap'
import Eyebrow from '@/components/public/ui/Eyebrow'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'

export default function AboutHero({
  kick,
  title,
  body,
  portraitImageUrl,
}: {
  kick?: string
  title: string
  body: string
  portraitImageUrl?: string
}) {
  const paragraphs = body.split('\n\n').filter(Boolean)

  return (
    <section className="page-top pb-8 sm:pb-10 bg-[var(--color-bone)]">
      <PageWrap>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 items-center">
          <div className="order-2 lg:order-1">
            {kick && <Eyebrow className="mb-4 sm:mb-6">{kick}</Eyebrow>}
            <h1
              className="text-[clamp(2rem,6vw,3.25rem)] font-extrabold tracking-tight leading-[1.05] mb-4 sm:mb-5 whitespace-pre-line text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h1>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base sm:text-[17px] text-[#3a4654] leading-relaxed mb-3.5 last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div
            className="order-1 lg:order-2 aspect-[4/5] max-h-[360px] sm:max-h-[420px] lg:max-h-none w-full mx-auto max-w-sm lg:max-w-none rounded-2xl sm:rounded-3xl relative overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-lead), var(--color-lead-deep))' }}
          >
            {portraitImageUrl?.trim() ? (
              <ImageWithPlaceholder
                src={portraitImageUrl}
                alt=""
                aspectRatio="auto"
                className="absolute inset-0 w-full h-full object-cover"
                placeholderLabel="Portrait"
              />
            ) : (
              <span
                className="font-black text-[6rem] sm:text-[8rem] lg:text-[10rem] text-white/20"
                style={{ fontFamily: 'var(--font-heading)' }}
                aria-hidden
              >
                g.
              </span>
            )}
            <span className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-5 h-5 sm:w-6 sm:h-6 bg-[var(--color-coral)] rounded-md" aria-hidden />
          </div>
        </div>
      </PageWrap>
    </section>
  )
}
